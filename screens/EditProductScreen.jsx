import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, removeProduct } from '../state/products/products';
import { useNavigation } from '@react-navigation/native';

const EditProductScreen = ({ route }) => {
    const { productId } = route.params;
    const product = useSelector(state => state.products.products.find(p => p.id === productId));
    const [title, setTitle] = useState(product?.title);
    const [description, setDescription] = useState(product?.description);
    const [price, setPrice] = useState(product?.price?.toString());
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleSave = async () => {
        dispatch(updateProduct({ id: productId, title, price: parseFloat(price) }));
        const response = await fetch(`https://fakestoreapi.com/product?id=${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, price: parseFloat(price) })
        });
        // if (!response.ok) {
        //     Alert.alert('Error', 'An error occurred while updating the product');
        //     return;
        // }
        // else
        navigation.goBack();
    };

    const deleteProduct = async () => {
        const response = await fetch(`https://fakestoreapi.com/product?id=${productId}`, {
            method: 'DELETE'
        });
        dispatch(removeProduct({ id: productId }));
        // if (!response.ok) {
        //     Alert.alert('Error', 'An error occurred while deleting the product');
        //     return;
        // }
        // else
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
