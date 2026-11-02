import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export const addToCartWithStockCheck = createAsyncThunk(
  'cart/addToCartWithStockCheck',
  async ({ product, quantity = 1 }, { getState, rejectWithValue }) => {
    try {
      let latestStock = product.stock || 0;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products/${product._id}`);
        if (res.data) {
          latestStock = res.data.stock;
        }
      } catch (err) {
        console.error('Failed to fetch latest stock', err);
      }

      const state = getState();
      const existing = state.cart.items.find((item) => item._id === product._id);
      if (existing) {
        if (existing.quantity >= latestStock) {
          return rejectWithValue('Stock limit reached');
        }
      } else {
        if (latestStock <= 0 || quantity <= 0) {
          return rejectWithValue('Out of stock');
        }
      }

      return { product, quantity, latestStock };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const verifyCartStockThunk = createAsyncThunk(
  'cart/verifyCartStockThunk',
  async (_, { getState }) => {
    const state = getState();
    const items = state.cart.items;
    if (!items || items.length === 0) return [];

    const updated = [];
    for (const item of items) {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products/${item._id}`);
        if (res.data && res.data.stock > 0) {
          updated.push({
            ...item,
            stock: res.data.stock,
            quantity: Math.min(item.quantity, res.data.stock),
          });
        }
      } catch (err) {
        console.error('Failed to verify product stock', err);
        updated.push(item);
      }
    }
    return updated;
  },
);

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload || [];
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item._id !== productId);
      } else {
        const item = state.items.find((item) => item._id === productId);
        if (item) {
          item.quantity = Math.min(item.stock, quantity);
        }
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartWithStockCheck.fulfilled, (state, action) => {
        const { product, quantity, latestStock } = action.payload;
        const existing = state.items.find((item) => item._id === product._id);
        if (existing) {
          existing.stock = latestStock;
          existing.quantity = Math.min(latestStock, existing.quantity + quantity);
        } else {
          state.items.push({
            ...product,
            stock: latestStock,
            quantity: Math.min(latestStock, quantity),
          });
        }
      })
      .addCase(verifyCartStockThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { setCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0,
  );
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

export default cartSlice.reducer;

