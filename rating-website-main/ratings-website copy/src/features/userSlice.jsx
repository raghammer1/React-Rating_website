import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  username: null,
  watchlist: null,
  isSignedIn: false,
};

const useSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userSetter: (state, { payload }) => {
      state.username = payload.userUsername;
      state.isSignedIn = true;
      state.userId = payload.userId;
      // console.log(state.username, state.isSignedIn, payload.userWatchlist);
      state.watchlist = payload.userWatchlist || [];
    },
    appendWatchlist: (state, { payload }) => {
      state.watchlist.push(payload.movie);
    },
    removeElementFromWatchlist: (state, { payload }) => {
      // console.log(payload);
      state.watchlist = state.watchlist.filter((w) => w.id !== payload.id);
    },
  },
});

export default useSlice.reducer;
export const { userSetter, appendWatchlist, removeElementFromWatchlist } =
  useSlice.actions;
