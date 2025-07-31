// frontend/screens/home/AddExpenseScreen.js

import React from 'react';
import { View, Alert, ScrollView } from 'react-native';
import AddExpenseForm from '../../components/AddExpenseForm';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';

const AddExpenseScreen = () => {
  const userId = '661effd822f4caa445d33c56'; // Replace with dynamic ID later if needed

  const handleSubmit = async (expenseData) => {
    try {
      const { name, amount, category, date } = expenseData; // ✅ Destructure here

      await axios.post(`${BASE_URL}/api/transactions`, {
        name,
        amount,
        category,
        date,
        userId,
        type: 'expense',
      });

      Alert.alert('Success', 'Expense added successfully!');
    } catch (err) {
      console.error('Error adding expense:', err.message);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };


  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <AddExpenseForm onSubmit={handleSubmit} />
    </ScrollView>
  );
};

export default AddExpenseScreen;
