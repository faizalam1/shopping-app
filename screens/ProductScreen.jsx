import React, { useState } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../state/cart/cart';
import { useNavigation } from '@react-navigation/native';

const ProductScreen = ({ route }) => {
    const { productId } = route.params;
    const product = useSelector(state => state.products.products.find(p => p.id === productId));
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

    const handleEditProduct = () => {
        setShowPasswordPrompt(true);
    };

    const handlePasswordSubmit = () => {
        if (password === 'Admin') {
            setShowPasswordPrompt(false);
            navigation.navigate('EditProduct', { productId: product.id });
        } else {
            Alert.alert('Error', 'Incorrect password');
        }
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
            <View className="flex-grow mt-8 flex items-center justify-center">
                <Text className="text-2xl">{product.title}</Text>
                <Text className="text-xl text-gray-600">${product.price}</Text>
                <Text className="text-base mt-4">{product.description}</Text>
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
            
            <View className="m-2">
                <Button
                    title="Edit Product"
                    onPress={handleEditProduct}
                />
            </View>
            {showPasswordPrompt && (
                <View className="absolute top-[30%] left-[30%] flex-1 justify-center items-center bg-gray-800 bg-opacity-75">
                    <View className="bg-white p-4 rounded-md">
                        <TextInput
                            className="border p-2 mb-4"
                            placeholder="Enter password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <View className="m-1">
                            <Button title="Submit" onPress={handlePasswordSubmit} />
                        </View>
                        <View className="m-1">
                            <Button title="Cancel" color="red" onPress={() => setShowPasswordPrompt(false)} />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default ProductScreen;
