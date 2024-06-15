import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an order
export const createOrder = createAsyncThunk('orders/createOrder', async (order, { rejectWithValue }) => {
  const token = await AsyncStorage.getItem('token');
  try{
    const response = await axios.post('http://192.168.10.2:5000/api/orders', order, {
      headers: { "x-auth-token": token }
    });
    console.log(response) 
    if (response.status === 201) 
      return response.data;
  }
  catch(error){
    return rejectWithValue(error.response.data.message);
  }
});

// Fetch orders for a user
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  const token = await AsyncStorage.getItem('token');
  try{
    const response = await axios.get('http://192.168.10.2:5000/api/orders', {
      headers: { "x-auth-token": token }
    });
    return response.data;
  }
  catch (error){
    return rejectWithValue(error.response.data.message)
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    status: null,
    error: null
  },
  reducers: {
    clearStatus: (state) => {
      state.status = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.orders.push(action.payload);
      })
        .addCase(createOrder.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  },
});

export const { clearStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
