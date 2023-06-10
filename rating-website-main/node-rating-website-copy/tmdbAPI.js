const axios = require('axios');

const apiKey = '85b384adccde8ffa5f46eed7f3e32746';

// const getMovies = async (page) => {
//   const url = 'https://api.themoviedb.org/3/discover/movie';
//   try {
//     const response = await axios.get(url, {
//       params: {
//         api_key: apiKey,
//         page,
//       },
//     });
//     return response.data.results;
//   } catch (error) {
//     console.error(error);
//   }
// };
const getMovies = async (page) => {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Request failed with status code ' + response.status);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
};

const getSearchMovies = async (searchQuery) => {
  const url = `https://api.themoviedb.org/3/search/movie?`;
  try {
    const response = await axios.get(url, {
      params: {
        api_key: apiKey,
        query: searchQuery,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(error);
  }
};

const getSingleMovie = async (id) => {
  const url = `https://api.themoviedb.org/3/movie/${id}`;
  try {
    const response = await axios.get(url, {
      params: {
        api_key: apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getMovies, getSearchMovies, getSingleMovie };
