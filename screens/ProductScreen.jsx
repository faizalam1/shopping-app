import React, { useState } from 'react';
import { View, Text, Image, Button, Alert, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../state/cart/cart';
import { useNavigation } from '@react-navigation/native';

const ProductScreen = ({ route }) => {
    const { productId } = route.params;
    const product = useSelector(state => state.products.products.find(p => p.id === productId));
    const cartItems = useSelector(state => state.cart.items);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigation = useNavigation();


    const handleEditProduct = () => {
        if (user.role !== "seller") {
            return Alert.alert('Unauthorized', 'Only sellers can edit products');
        }
        navigation.navigate('EditProduct', { productId });
    };


    if (!product) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Product not found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4">
            <View className="flex-grow mt-8 flex items-center">
                <View className="flex items-center justify-center m-4">
                    <Image
                        source={{ uri: product.image }}
                        className="w-32 h-32"
                    />
                </View>
                <Text className="text-2xl">{product.title}</Text>
                <Text className="text-xl text-gray-600">{product.price} PKR</Text>
                <Text className="text-base mt-4">{product.description}</Text>
                <Text className="text-base mt-4">Category: {product.category}</Text>
                <Text className="text-base mt-4">Stock: {product.stockCount}</Text>
            </View>
            {
                cartItems.find(i => i.id === product.id) ? (
                    <Text className="text-gray-600 text-center text-xl">Added</Text>
                ) : (
                    <View className="m-2">
                        <Button title="Add to Cart" onPress={() => dispatch(addToCart(product))} />
                    </View>
                )
            }
            
            { user?.role == "seller" &&
            (<View className="m-2">
                <Button
                    title="Edit Product"
                    onPress={handleEditProduct}
                />
            </View>)}
        </View>
    );
};

export default ProductScreen;
