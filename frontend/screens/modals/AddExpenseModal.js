// frontend/screens/modals/AddExpenseModal.js
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  Alert, // Use Alert from react-native
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import AddExpenseForm from '../../components/AddExpenseForm';

const AddExpenseModal = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ Extract all three parameters passed from the notification handler
  const { name, amount, date } = route?.params || {};

  const [isVisible, setIsVisible] = useState(true);

  const closeModal = () => {
    setIsVisible(false);
    // The onModalHide will handle navigation.goBack()
  };

  const handleFormSubmit = async (data) => {
    const userId = '661effd822f4caa445d33c56'; // Replace with dynamic ID later
    try {
      // Use the submitted data from the form
      await axios.post(`${BASE_URL}/api/transactions`, {
        name: data.name,
        amount: data.amount,
        category: data.category,
        date: data.date,
        userId,
        type: 'expense',
      });

      console.log('✅ Expense successfully added to backend!');
      Alert.alert('Success', 'Expense added successfully!');
      closeModal();
    } catch (err) {
      console.error('❌ Error adding expense:', err.message);
      Alert.alert('Failed to add expense', 'Please try again.');
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      onModalHide={() => {
        // This ensures navigation happens only after the modal is fully hidden
        navigation.goBack();
      }}
      style={styles.modal}
      backdropOpacity={0.35}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver
      useNativeDriverForBackdrop
      avoidKeyboard
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardWrapper}
      >
        <View style={styles.container}>
          {/* Modal Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Expense</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formWrapper}>
            <AddExpenseForm
              onSubmit={handleFormSubmit}
              onClose={closeModal}
              // ✅ Pass all initial values to the form component
              initialName={name}
              initialAmount={amount}
              initialDate={date}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  keyboardWrapper: {
    flex: 1,
  },
  container: {
    height: Dimensions.get('window').height * 0.65,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  cancelText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
  },
  formWrapper: {
    flex: 1,
  },
});

export default AddExpenseModal;
