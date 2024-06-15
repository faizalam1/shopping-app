// screens/OrdersScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, clearStatus } from '../state/orders/orders';


const OrdersScreen = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const orderStatus = useSelector((state) => state.orders.status);
  const orderError = useSelector((state) => state.orders.error);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orderStatus === 'failed') {
      Alert.alert('Error', orderError);
      dispatch(clearStatus());
    }
  }, [orderStatus, orderError]);

  const renderProduct = (product) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: product.productId.image }} style={styles.image} />
      <View style={styles.productDetails}>
        <Text style={styles.title}>{product.productId.title}</Text>
        <Text>Price: {product.productId.price} PKR</Text>
        <Text>Quantity: {product.quantity}</Text>
      </View>
    </View>
  );

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderId}>Order ID: {item._id}</Text>
      <Text style={styles.date}>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
      <FlatList
        data={item.products}
        renderItem={({ item }) => renderProduct(item)}
        keyExtractor={(item) => item._id}
      />
      <Text style={styles.totalAmount}>Total Amount: {item.totalAmount.toFixed(2)} PKR</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  orderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  orderId: {
    fontWeight: 'bold',
  },
  date: {
    color: '#555',
  },
  productContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  totalAmount: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default OrdersScreen;
