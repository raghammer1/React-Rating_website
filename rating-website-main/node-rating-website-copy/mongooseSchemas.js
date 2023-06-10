const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: Number,
  title: String,
  poster_path: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  watchlist: [movieSchema],
});

const genreSchema = mongoose.Schema({ id: Number, name: String });

// const movieFullDataSchema = new mongoose.Schema({
//   id: Number,
//   poster_path: String,
//   title: String,
//   adult: Boolean,
//   overview: String,
//   status: String,
//   popularity: Number,
//   vote_average: Number,
//   runtime: Number,
//   original_language: String,
//   genres: [genreSchema],
//   release_date: String,
// });

const Movie = mongoose.model('Movie', movieSchema);
// const MovieFullData = mongoose.model('MovieFullData', movieFullDataSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  Movie,
  User,
  // MovieFullData,
};
