import React, { useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getCategories, setCategoryFilter } from '../state/products/products';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { addToCart } from '../state/cart/cart';
import { logoutUser } from '../state/auth/auth';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);
    const categories = useSelector(state => state.products.categories);
    const categoryFilter = useSelector(state => state.products.categoryFilter);
    const status = useSelector(state => state.products.status);
    const cartItems = useSelector(state => state.cart.items);
    const user = useSelector(state => state.auth.user);
    const navigation = useNavigation();
    let filteredProducts = categoryFilter ? products.filter(p => p.category === categoryFilter) : products;

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        filteredProducts = products.filter(p => p.category === categoryFilter);
    }, [categoryFilter, products]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <View className="flex flex-row space-x-2">
                        <View>
                            <Button
                                title="View Cart"
                                onPress={() => navigation.navigate('Cart')}
                            />
                        </View>
                        <View>
                            <Button
                                title='Orders'
                                onPress={() => navigation.navigate('Orders')}
                                />
                        </View>
                        <View>
                            <Button
                                title="Logout"
                                onPress={() => dispatch(logoutUser())}
                            />
                        </View>
                    </View>
                    
                </>
            )
        });
    }, [navigation]);

    if (status === 'loading') {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    const handleAddProduct = () => {
        if (user.role != "seller") 
            return Alert.alert('Unauthorized', 'Only sellers can add products');
        navigation.navigate('AddProduct');
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            className="p-4 border-b border-gray-200 flex flex-row justify-between items-center space-x-4"
            onPress={() => navigation.navigate('Product', { productId: item.id })}
        >
            <View>
                <Image
                    source={{ uri: item.image }}
                    className="w-16 h-16"
                />
            </View>
            <View className="w-48">
            <Text className="text-xl text-justify">{item.title}</Text>
            <Text className="text-gray-600">{item.price} PKR</Text>
            <Text className="text-gray-600">Stock: {item.stockCount}</Text>
            <View className="mx-auto">
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
            </View>
            </View>
            
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 p-4">
            <Text className="text-xl">Welcome {user.username}</Text>
            <Picker
                selectedValue={categoryFilter}
                onValueChange={(itemValue) => dispatch(setCategoryFilter(itemValue))}
                >
                <Picker.Item label="All" value="All" />
                {categories.map(c => (
                    <Picker.Item label={c} value={c} key={c} />
                ))}
                </Picker>
            <FlatList
                data={categoryFilter !== 'All' ? filteredProducts : products}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            
            {user?.role == "seller" && 
            (<View className="m-2">
                <Button 
                    title="Add Product"
                    onPress={handleAddProduct}
                />
            </View>)}
        </View>
    );
};

export default HomeScreen;
