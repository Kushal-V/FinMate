// frontend/components/TransactionList.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown Date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const TransactionList = ({ transactions }) => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name || 'Unnamed Transaction'}</Text>
      <Text style={styles.amount}>₹{item.amount || 0}</Text>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
      <Text style={styles.category}>{item.category || 'Uncategorized'}</Text>
    </View>
  );

  if (!transactions || transactions.length === 0) {
    return <Text style={styles.loading}>No transactions found.</Text>;
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  item: {
    marginBottom: 10,
    padding: 14,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 3,
        }),
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  amount: { fontSize: 15, color: '#333' },
  date: { fontSize: 13, color: '#777' },
  category: { fontStyle: 'italic', color: '#555' },
  loading: { textAlign: 'center', marginTop: 20 },
});

export default TransactionList;
