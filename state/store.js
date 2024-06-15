import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/cart';
import productsReducer from './products/products';
import authReducer from './auth/auth';
import ordersReducer from './orders/orders';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productsReducer,
        auth: authReducer,
        orders: ordersReducer
    }
});