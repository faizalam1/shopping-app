import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./state/store";
import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/CartScreen";
import ProductScreen from "./screens/ProductScreen";
import EditProductScreen from "./screens/EditProductScreen";
import AddProductScreen from "./screens/AddProductScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import OrdersScreen from "./screens/OrdersScreen";
import { getUser, logoutUser } from "./state/auth/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Logine">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const SellerAppStack = () => {
  return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="EditProduct" component={EditProductScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
      </Stack.Navigator>
  );
};

const UserAppStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
    </Stack.Navigator>
  );
}

const RootNavigation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        dispatch(logoutUser());
      }
      else {
        dispatch(getUser());
      }
    }
    checkToken();
  },[dispatch])

  return (
    <NavigationContainer>
      {user ? (user?.role == "user" ? <UserAppStack /> : <SellerAppStack />) : <AuthStack />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
  <Provider store={store}>
    <RootNavigation />
  </Provider>);
}

