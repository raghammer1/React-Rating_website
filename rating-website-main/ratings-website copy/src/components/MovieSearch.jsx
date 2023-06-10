import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const MovieSearch = (props) => {
  const { searchQuery, setSearchQuery } = props;

  const [searchQueryLocal, setSearchQueryLocal] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const apiKey = '85b384adccde8ffa5f46eed7f3e32746';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQueryLocal === '') {
      navigate('/home', { relative: true });
      return;
    }
    navigate(`/search/${searchQueryLocal}`, { relative: true });
    setSearchQuery(searchQueryLocal);
  };
  // useEffect(() => {
  //   fetch(
  //     `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setSearchResults(data.results);
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // }, [searchQuery]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/search?searchQuery=${searchQuery}`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [searchQuery]);

  if (!searchResults) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
      <form className="search-form" onSubmit={(e) => handleSearch(e)}>
        <input
          className="search-input"
          type="text"
          value={searchQueryLocal}
          onChange={(e) => setSearchQueryLocal(e.target.value)}
          placeholder="Enter search query"
        />
        <Link to={`/search/${searchQueryLocal}`} className="search-link">
          <button className="search-button" onClick={(e) => handleSearch(e)}>
            Search
          </button>
        </Link>
      </form>
      <ul className="grid-4--cols">
        {searchResults.map((movie) => (
          <li key={movie.id} className="grid-item">
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <a>
                <h3>{movie.title}</h3>
              </a>
            </Link>
            <img
              src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              alt={movie.title}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieSearch;
