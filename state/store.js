import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/cart';
import productsReducer from './products/products';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productsReducer
    }
});