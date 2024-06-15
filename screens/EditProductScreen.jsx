import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, removeProduct } from '../state/products/products';
import { useNavigation } from '@react-navigation/native';

const EditProductScreen = ({ route }) => {
    const { productId } = route.params;
    const product = useSelector(state => state.products.products.find(p => p.id === productId));
    const [title, setTitle] = useState(product?.title);
    const [image, setImage] = useState(product?.image);
    const [description, setDescription] = useState(product?.description);
    const [price, setPrice] = useState(product?.price?.toString());
    const [category, setCategory] = useState(product?.category);
    const [stockCount, setStockCount] = useState(product?.stockCount.toString());
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleSave = async () => {
        dispatch(updateProduct({ id: productId, title, price: parseFloat(price), description, image, category, stockCount: parseInt(stockCount)}));
        navigation.goBack();
    };

    const deleteProduct = async () => {
        dispatch(removeProduct(productId));
        navigation.navigate('Home');
    }

    const handleDelete = async () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => {
                    deleteProduct()
                }}
            ]
        );
    };

    return (
        <View className="flex-1 p-4">
            <Text className="text-xl">Edit Product</Text>
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
                
            <View className="m-2 mt-8">
                <Button title="Save" onPress={handleSave} />
            </View>
            <View className="m-2">
                <Button title="Delete" color="red" onPress={handleDelete} />
            </View>
        </View>
    );
};

export default EditProductScreen;
