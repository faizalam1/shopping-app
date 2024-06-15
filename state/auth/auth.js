import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://192.168.10.2:5000/api/auth/login', { email, password  });
      await AsyncStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://192.168.10.2:5000/api/auth/register', { username, email, password, confirmPassword });
      await AsyncStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUser = createAsyncThunk('auth/getUser', async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    return rejectWithValue('No token');
  }
  const response = await axios.get('http://192.168.10.2/api/auth/me', {
    headers: {
      'x-auth-token': token
    }
  });
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    error: null
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      AsyncStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      });
  }
});

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;
