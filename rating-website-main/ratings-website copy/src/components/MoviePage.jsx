import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToList } from '../features/watchlistSlice';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { selectItem } from '../features/movieSlice';
import { appendWatchlist } from '../features/userSlice';

const MoviePage = () => {
  const apiKey = '85b384adccde8ffa5f46eed7f3e32746';
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  // const watchlistReducer = useSelector((store) => store.watchlist);
  // const moviesReducer = useSelector((store) => store.movies);
  const userReducer = useSelector((store) => store.users);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  console.log(id);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        setMovie(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [id, apiKey]);

  // useEffect(() => {
  //   if (id) {
  //     dispatch(selectItem(id));
  //     setMovie(moviesReducer.selectedItems[0]);
  //   }
  // }, [id, apiKey]);

  // useEffect(() => {
  //   setMovie(moviesReducer.selectedItems);
  //   console.log('SELECTED ITEM IS THIS', moviesReducer.selectItem);
  // }, [moviesReducer.selectedItems]);

  console.log(movie);

  const addToWatchlist = () => {
    for (let m of userReducer.watchlist) {
      console.log(movie.id, m.id);
      if (movie.id === m.id) {
        setOpen(true);
        console.log('DUPLICATE FOUND');
        return;
      }
    }
    dispatch(appendWatchlist({ movie }));
    fetch('http://localhost:3000/watchlist', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ watchlist: movie, userId: userReducer.userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  function closeModal() {
    setOpen(false);
  }

  if (!movie) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
      <div className="container">
        <div className="movie-info">
          <img
            src={`https://image.tmdb.org/t/p/w400/${movie.poster_path}`}
            alt={movie?.title}
          />
          <div className="details">
            <h1>{movie?.title}</h1>
            <p>
              <b>Release Date</b>: {movie?.release_date}
            </p>
            <p>
              <b>Made in</b>: {movie.original_language}
            </p>
            <div className="genres">
              <b>Genre: </b>
              <span>&nbsp;</span>
              {movie?.genres.map((g) => (
                <Fragment key={g.id}>
                  <p>{`${g.name}`}</p>
                  <span>,&nbsp;</span>
                </Fragment>
              ))}
            </div>
            <p>
              <b>Runtime</b>: {movie?.runtime} minutes
            </p>
            <p style={{ display: 'inline' }}>
              <b>Rated:</b>{' '}
              {movie?.adult ? <span key={1}>PG</span> : <span key={2}>R</span>}
            </p>
            <p className="movie-overview">
              <b>Overview</b>: {movie?.overview}
            </p>
            <div className="ratings">
              <div className="rating-item ri-down">
                <h2>Status</h2>
                <p>{movie.status}</p>
              </div>

              <div className="rating-item">
                <h2>Ratings</h2>
                <p>{Math.ceil(movie.vote_average)}/10</p>
              </div>

              <div className="rating-item ri-down">
                <h2>Popularity</h2>
                <p>{Math.ceil(movie.popularity)}</p>
              </div>
            </div>
            {userReducer.isSignedIn ? (
              <button onClick={() => addToWatchlist()} className="watchlist">
                Add to watchlist
              </button>
            ) : (
              <button className="watchlist">Sign in to add to watchlist</button>
            )}
          </div>
        </div>
      </div>
      {open && (
        <Modal open={open} onClose={closeModal} center animationDuration={300}>
          <p style={{ color: 'black' }}>
            {`"${movie.title}" has already been added to the watchlist!`}
          </p>
        </Modal>
      )}
    </div>
  );
};
export default MoviePage;
