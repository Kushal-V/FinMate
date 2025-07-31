// frontend/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://192.168.31.159:5000/api/auth/register', {
        name,
        email,
        password,
      });

      if (res.data.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        navigation.replace('Dashboard'); // You could also navigate to Login
      }
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Registration Failed', error?.response?.data?.message || 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register for FinMate</Text>
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Register" onPress={handleRegister} />
      <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
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
  loginLink: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
