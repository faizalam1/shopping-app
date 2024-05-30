import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { addProduct } from '../state/products/products';

const AddProductScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const dispatch = useDispatch();

    const handleSave = async () => {
        const newProduct = { id: Date.now(), title, description, price: parseFloat(price) };
        dispatch(addProduct(newProduct));
        const response = await fetch('https://fakestoreapi.com/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });
        navigation.goBack();
    };

    return (
        <View className="flex-1 p-4">
            <Text className="text-xl">Add Product</Text>
            <TextInput
                className="border p-2 mt-4"
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
            />
            <TextInput
                className="border p-2 mt-4"
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
            />
            <TextInput
                className="border p-2 mt-4"
                value={price}
                onChangeText={setPrice}
                placeholder="Price"
                keyboardType="numeric"
            />
            <View className="mt-8">
                <Button title="Save" onPress={handleSave} />
            </View>
        </View>
    );
};

export default AddProductScreen;
