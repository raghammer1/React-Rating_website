import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  fullWatchlist: [],
  totalMovies: 0,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToList: (state, { payload }) => {
      // console.log(payload);
      state.fullWatchlist.push(payload.movie);
    },
  },
});

export default watchlistSlice.reducer;
export const { addToList } = watchlistSlice.actions;
