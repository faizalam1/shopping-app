import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, Alert, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../state/products/products';
import { useNavigation } from '@react-navigation/native';
import { addToCart } from '../state/cart/cart';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);
    const cartItems = useSelector(state => state.cart.items);
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const handleAddProduct = () => {
        setShowPasswordPrompt(true);
    };

    const handlePasswordSubmit = () => {
        if (password === 'Admin') {
            setShowPasswordPrompt(false);
            navigation.navigate('AddProduct');
        } else {
            Alert.alert('Error', 'Incorrect password');
            setShowPasswordPrompt(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            className="p-4 border-b border-gray-200 flex flex-row justify-between items-center"
            onPress={() => navigation.navigate('Product', { productId: item.id })}
        >
            <View>
            <Text className="text-xl">{item.title}</Text>
            <Text className="text-gray-600">{item.price} PKR</Text>
            </View>
            {
                cartItems.find(i => i.id === item.id) ? (
                    <Text className="text-gray-600">Added</Text>
                ) : (
                    <Button
                        title="Add to Cart"
                        onPress={() => dispatch(addToCart(item))}
                    />
                )
            }
            
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 p-4">
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />

            <View className="m-2">
                <Button
                    title="View Cart"
                    onPress={() => navigation.navigate('Cart')}
                />
            </View>
            
            <View className="m-2">
                <Button 
                    title="Add Product"
                    onPress={handleAddProduct}
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

export default HomeScreen;
