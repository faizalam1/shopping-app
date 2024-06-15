import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { removeItem } from "../cart/cart";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getCategories = createAsyncThunk('products/getCategories', async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get('http://192.168.10.2:5000/api/products/categories', {
    headers: {
      'x-auth-token': token
    }
  });
  return response.data;
});
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get("http://192.168.10.2:5000/api/products", {
      headers: {
        "x-auth-token": token,
      },
    });
    return response.data;
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product) => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(
      "http://192.168.10.2:5000/api/products",
      product,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    return response.data;
  }
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id) => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.delete(
      `http://192.168.10.2:5000/api/products/${id}`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    return {id};
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (product) => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.put(
      `http://192.168.10.2:5000/api/products/${product.id}`,
      product,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    categories: [],
    categoryFilter: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(getProducts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products = [...state.products, action.payload];
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload.id
        );
        removeItem(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((product) => {
          if (product.id !== action.payload.id) {
            return product;
          }
          return { ...product, ...action.payload };
        });
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCategoryFilter } = productsSlice.actions;
export default productsSlice.reducer;
