import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../state/products/products';

const AddProductScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [stockCount, setStockCount] = useState('');
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);

    const handleSave = async () => {
        const newProduct = { id: products.length + 1, title, description, price: parseFloat(price), image, category, stockCount: parseInt(stockCount)};
        dispatch(addProduct(newProduct));
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
                value={image}
                onChangeText={setImage}
                placeholder="Image URL"
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
            <TextInput
                className="border p-2 mt-4"
                value={category}
                onChangeText={setCategory}
                placeholder="Category"
            />
            <TextInput
                className="border p-2 mt-4"
                value={stockCount}
                onChangeText={setStockCount}
                placeholder="Stock Count"
                keyboardType="numeric"
            />
            <View className="mt-8">
                <Button title="Save" onPress={handleSave} />
            </View>
        </View>
    );
};

export default AddProductScreen;
