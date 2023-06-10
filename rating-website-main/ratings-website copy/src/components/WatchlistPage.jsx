import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { removeElementFromWatchlist } from '../features/userSlice';

const WatchlistPage = () => {
  const watchlistReducer = useSelector((store) => store.watchlist);
  const userReducer = useSelector((store) => store.users);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    console.log('delete', id);
    fetch(`http://localhost:3000/watchlist`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        userId: userReducer.userId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // The movie was successfully deleted
          // You can update your component's state or perform any other necessary actions
          dispatch(removeElementFromWatchlist({ id }));
          console.log('Movie deleted');
        } else {
          console.error('Failed to delete movie');
        }
      })
      .catch((error) => {
        console.error('Error deleting movie', error);
      });
  };

  if (!userReducer.isSignedIn) {
    return (
      <div>
        <h1>Please Sign In to view your watchlist</h1>
      </div>
    );
  }

  if (userReducer.watchlist.length === 0) {
    return (
      <div>
        <h1>Your Watchlist is EMPTY</h1>
      </div>
    );
  }
  return (
    <div>
      <h1>Your Watchlist</h1>

      <ul className="grid-4--cols">
        {userReducer.watchlist.map((movie) => (
          <li key={movie.id} className="grid-item watchlist-items">
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <h3>{movie.title}</h3>
            </Link>
            <img
              src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              alt={movie.title}
              className="watchlist-image"
            />
            <button
              onClick={() => handleDelete(movie.id)}
              className="watchlist-remove-btn"
            >
              remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default WatchlistPage;
