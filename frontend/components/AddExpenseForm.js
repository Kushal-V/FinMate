// frontend/components/AddExpenseForm.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  Platform,
  Alert, // Import Alert for consistent pop-ups
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// This conditional import for web is fine.
let DatePicker;
if (Platform.OS === 'web') {
  DatePicker = require('react-datepicker').default;
  require('react-datepicker/dist/react-datepicker.css');
}

const AddExpenseForm = ({
  onSubmit,
  onClose,
  initialName = '', // ✅ Accept initialName prop
  initialAmount = '',
  initialDate, // Can be a string or Date object
}) => {
  // ✅ Use the initial props to set the default state of the form
  const [name, setName] = useState(initialName);
  const [amount, setAmount] = useState(initialAmount.toString());
  const [category, setCategory] = useState(''); // Default to empty, let user choose
  // ✅ Handle both string and Date object for initialDate
  const [date, setDate] = useState(initialDate ? new Date(initialDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAdd = () => {
    if (!name || !amount || !category) {
      // Use the React Native Alert for consistency
      Alert.alert('Missing Fields', 'Please fill in all fields before submitting.');
      return;
    }

    onSubmit({
      name,
      amount: parseFloat(amount),
      category,
      date,
    });

    // The parent modal (AddExpenseModal) now handles closing.
    // No need to reset state here as the component will unmount.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Expense Name</Text>
      <TextInput
        placeholder="e.g., Tea, Uber"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        placeholder="e.g., 50"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a category..." value="" />
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Groceries" value="Groceries" />
          <Picker.Item label="Transport" value="Transport" />
          <Picker.Item label="Entertainment" value="Entertainment" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>

      <Text style={styles.label}>Date</Text>
      {Platform.OS === 'web' ? (
        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          dateFormat="dd/MM/yyyy"
          className="web-datepicker"
        />
      ) : (
        <>
          <Button
            title={`Selected: ${date.toDateString()}`}
            onPress={() => setShowDatePicker(true)}
            color="#2563eb"
          />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Add Expense" onPress={handleAdd} color="#2563eb" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
    justifyContent: 'center', // Center the picker content
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 120 : 55, // Adjust height for iOS picker wheel
    color: '#000',
  },
});

export default AddExpenseForm;