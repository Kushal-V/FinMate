// frontend/screens/LoginScreen.js

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext'; // 👈 Import context
import { BASE_URL } from '../utils/config';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setIsAuthenticated } = useContext(AuthContext); // 👈 Use context

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setIsAuthenticated(true); // ✅ Works now
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Failed', error.response?.data?.message || 'Network error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FinMate Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#999',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  registerLink: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
