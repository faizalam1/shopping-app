import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../state/auth/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {auth.error && <Text style={styles.error}>{auth.error.message}</Text>}
      <View className="flex-col space-y-2">
        <View>
          <Button title="Login" onPress={handleLogin} />
        </View>
        <View>
          <Button title="Register"  onPress={() => navigation.navigate('Register')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10
  },
  error: {
    color: 'red',
    marginBottom: 10
  }
});

export default LoginScreen;
