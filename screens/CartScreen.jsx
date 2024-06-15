import React, {useEffect} from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../state/cart/cart';
import { createOrder, clearStatus } from '../state/orders/orders';
import { getProducts } from '../state/products/products';

const CartScreen = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const orderStatus = useSelector(state => state.orders.status);
    const orderError = useSelector(state => state.orders.error);

    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    useEffect(() => {
        if (orderStatus === 'succeeded') {
            Alert.alert('Order Placed', 'Your order has been placed successfully');
            dispatch(clearStatus());
            dispatch(getProducts());
            dispatch(clearCart());
        }
        if (orderStatus === 'failed') {
            Alert.alert('Order Failed', orderError);
            dispatch(clearStatus())
        }
    }, [orderStatus, orderError]);

    const checkout = async () => {
        if (cartItems.length === 0) {
            return Alert.alert('Empty Cart', 'Add some products to cart before checking out');
        }
        const order = {
            products: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
            totalAmount: totalPrice
        }
        dispatch(createOrder(order))
    }

    const handleCheckout = () => {
        Alert.alert(
            'Confirm Order',
            'Are you sure you want to checkout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Checkout', onPress: () => {
                    checkout()
                }}
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View className="w-60">
                <Text className="text-xl">{item.title}</Text>
                <Text className="text-gray-600">{item.price} x {item.quantity} PKR</Text>
            </View>
            <View className="flex flex-row">
                <View className="m-2">
                    <Button
                        className="p-2"
                        title="+"
                        onPress={() => dispatch(addToCart(item))}
                    />
                </View>
                <View className="m-2">
                    <Button
                        className="p-2"
                        title="-"
                        onPress={() => dispatch(removeFromCart(item))}
                    />
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 p-4">
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            <View className="mt-4">
                <Text className="text-xl">Total: {totalPrice.toFixed(2)} PKR</Text>
            </View>
            <View className="m-2">
                <Button
                    title="Checkout"
                    onPress={handleCheckout}
                />
            </View>
            <View className="m-2">
                <Button
                    title="Clear Cart"
                    color="red"
                    onPress={() => dispatch(clearCart())}
                />
            </View>
        </View>
    );
};

export default CartScreen;
