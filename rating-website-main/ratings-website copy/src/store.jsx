import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './features/movieSlice';
import watchlistReducer from './features/watchlistSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    watchlist: watchlistReducer,
    users: userReducer,
  },
});
