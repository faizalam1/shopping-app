import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { removeItem } from "../cart/cart";


const initialState = {
  products: [],
  status: "idle",
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products = [...state.products, action.payload];
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload.id
      );
      removeItem(action.payload)
    },
    updateProduct: (state, action) => {
      state.products = state.products.map((product) => {
        if (product.id !== action.payload.id) {
          return product;
        }
        return { ...product, ...action.payload };
      });
    },
  },
  extraReducers: (builder) => {
    builder
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
        });
  },
});

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    //return data;
    return [
      { id: 1, title: "Product 1", description: "It is product 1.", price: 100 },
      { id: 2, title: "Product 2", description: "It is product 2.", price: 200 },
      { id: 3, title: "Product 3", description: "It is product 3.", price: 300 },
    ];
  }
);

export const { addProduct, removeProduct, updateProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
