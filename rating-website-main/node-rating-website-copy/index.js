const express = require('express');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const port = 3000;
const { Movie, User } = require('./mongooseSchemas');
const { getMovies, getSearchMovies, getSingleMovie } = require('./tmdbAPI');
const connection = require('./mongoDbConnection');
const encrypt = require('./encryption');
const { ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

connection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const pagination = async (page) => {
  const pageSize = 20; // Number of documents per page
  const start = (page - 1) * pageSize; // Calculate the starting index
  const end = page * pageSize;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    const db = client.db('movieDB');
    const movies = db.collection('movies');
    const documents = await movies.find().skip(start).limit(pageSize).toArray();
    return documents; // Return the retrieved documents
  } catch (error) {
    console.error(error);
  } finally {
    client.close(); // Close the MongoDB connection
  }
};

app.route('/home').get(async (req, res) => {
  const page = req.query.page;
  const movies = await pagination(page);
  res.json(movies);
});

app.route('/search').get(async (req, res) => {
  const searchQuery = req.query.searchQuery;
  const movies = await getSearchMovies(searchQuery);
  res.json(movies);
});

app.route('/signin').get(async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  const encryptedPassword = encrypt(password);
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    const db = client.db('movieDB');
    const users = db.collection('users');
    const documents = await users.find().toArray();
    const userDets = documents.filter(
      (m) => m.username === username && m.password === encryptedPassword
    );
    console.log(userDets);
    if (userDets.length === 0) {
      res.json({ userFound: false });
    } else {
      res.json({ userFound: true, userDets });
    }
  } catch (err) {
    console.log(err);
    res.json({ userFound: false });
  }
});

async function updateWatchlist(loggedInUserId, newItemOnWatchlist) {
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    const db = client.db('movieDB');
    const users = db.collection('users');
    // Find the user document based on the user ID
    const filter = { _id: new ObjectId(loggedInUserId) };
    const documents = await users
      .find({ _id: new ObjectId(loggedInUserId) })
      .toArray();
    console.log(documents[0].watchlist);
    const update = {
      $set: {
        watchlist: [...documents[0].watchlist, newItemOnWatchlist],
      },
    };

    const result = await users.updateOne(filter, update);
    console.log(`Modified ${result.modifiedCount} user document(s).`);
  } catch (error) {
    console.error('Error updating watchlist:', error);
  } finally {
    await client.close();
  }
}

app
  .route('/watchlist')
  .put(async (req, res) => {
    // console.log(req.body.userId);
    const { title, id, poster_path } = req.body.watchlist;
    const userId = req.body.userId;
    const newWatchlist = { title, id, poster_path };
    await updateWatchlist(userId, newWatchlist);
    res.json({ success: true });
  })
  .delete(async (req, res) => {
    const id = req.body.id;
    const userId = req.body.userId;
    const client = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
    });
    try {
      const db = client.db('movieDB');
      const users = db.collection('users');
      const filter = { _id: new ObjectId(userId) };
      const documents = await users
        .find({ _id: new ObjectId(userId) })
        .toArray();
      console.log(documents[0].watchlist);
      const updatedWatchlist = documents[0].watchlist.filter(
        (w) => w.id.toString() !== id.toString()
      );
      console.log(updatedWatchlist);
      const update = {
        $set: {
          watchlist: [...updatedWatchlist],
        },
      };
      const result = await users.updateOne(filter, update);
      console.log(`Modified ${result.modifiedCount} user document(s).`);
      res.send('DONE');
      return;
    } catch (err) {
      res.status(400);
    }
    res.status(400);
  });

const checkIfUserNameAlreadyExists = async (user) => {
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    const db = client.db('movieDB');
    const users = db.collection('users');
    const document = users.find({ username: user }).toArray();
    if ((await document).length !== 0) {
      return true;
    }
  } catch (e) {
    console.log(e);
    return true;
  }
  return false;
};

const validityChecker = (username, password) => {
  if (username.length < 4 || password.length < 6) {
    return false;
  }
  return true;
};
const createNewUser = async (username, password) => {
  const user = {
    username,
    password,
    watchlist: [],
  };
  try {
    const userNew = new User(user);
    const savedUser = await userNew.save();
    console.log('User saved:', savedUser);
    return { status: 'account created successfully' };
  } catch (error) {
    console.error('Error saving user:', error);
    return { status: 'error' };
  }
};

app.route('/signup').post(async (req, res) => {
  if (await checkIfUserNameAlreadyExists(req.body.username)) {
    res.json({ status: 'Username already exists' });
  } else if (!validityChecker(req.body.username, req.body.password)) {
    res.json({
      status:
        'Username (at least 4 characters) or password (at least 6 characters) too short',
    });
  } else {
    const encryptedPassword = encrypt(req.body.password);
    const answer = await createNewUser(req.body.username, encryptedPassword);
    console.log(answer);
    res.json(answer);
  }
});

// async function trial() {
//   const client = new MongoClient('mongodb://localhost:27017', {
//     useUnifiedTopology: true,
//   });
//   try {
//     const db = client.db('movieDB');
//     const users = db.collection('users');
//     const documents = await users.find().toArray();
//     console.log(
//       documents.filter((m) => m.username === 'Syna' && m.password === 'Syna')
//     );
//   } catch (err) {
//     console.log('ERROR', err);
//   }
// }
// trial();
// const user = {
//   username: 'raghav',
//   password: encrypt('raghav'),
//   watchlist: [],
// };
// const userNew = new User(user);
// userNew
//   .save()
//   .then((savedMovie) => {
//     console.log('Movie saved:', savedMovie);
//   })
//   .catch((error) => {
//     console.error('Error saving movie:', error);
//   });

// const getMovie = async (page) => {
//   for (let i = 501; i < 502; i++) {
//     const movies = await getMovies(i);
//     console.log(movies);
//     for (let movie of movies) {
//       const mov = {
//         id: movie.id,
//         poster_path: movie.poster_path,
//         title: movie.title,
//       };
//       const m = new Movie(mov);
//       m.save()
//         .then((savedMovie) => {
//           console.log('Movie saved:', savedMovie);
//         })
//         .catch((error) => {
//           console.error('Error saving movie:', error);
//         });
//     }
//   }
// };
// getMovie(1);
// let db;
// db = mongoose.connection;

// const userData = {
//   username: 'user',
//   password: 'password',
//   watchlist: [
//     { id: 1, title: 'Example Movie', poster_path: '/path/to/poster.jpg' },
//   ],
// };

// const user = new User(userData);
// user
//   .save()
//   .then((savedMovie) => {
//     console.log('Movie saved:', savedMovie);
//   })
//   .catch((error) => {
//     console.error('Error saving movie:', error);
//   });
