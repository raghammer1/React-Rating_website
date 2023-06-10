const mongoose = require('mongoose');

function connectToDatabase() {
  return mongoose.connect('mongodb://localhost:27017/movieDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectToDatabase;
