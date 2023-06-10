import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cartItems: [],
  totalPages: 500,
  currentPage: null,
  isLoading: true,
  selectedItems: [],
};

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    pageChange: (state, { payload }) => {
      console.log(payload.p);
      state.currentPage = payload.p;
    },
    pageChangeLink: (state, { payload }) => {
      state.currentPage = payload.pageNumLinks || 1;
    },
    setCart: (state, { payload }) => {
      console.log(payload.allMovies, 'I AM YOU PAYLOAD');
      state.cartItems = payload.allMovies;
      state.isLoading = false;
    },
    selectItem: (state, { payload }) => {
      console.log(payload, 'THIS ITHE PAYLOAD s', state.cartItems);
      state.selectedItems = state.cartItems.find(
        (item) => item.id === parseInt(payload)
      );
      console.log(state.selectedItems, 'THIS ITHE');
    },
    setLoadingFalse: (state, action) => {
      state.isLoading = false;
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export default movieSlice.reducer;
export const {
  pageChange,
  pageChangeLink,
  selectItem,
  setCart,
  setLoadingFalse,
} = movieSlice.actions;
