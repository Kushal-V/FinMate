// frontend/screens/home/TransactionsScreen.js

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../../utils/config.js';

const TransactionsScreen = () => {
  const userId = '661effd822f4caa445d33c56';
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // New

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Reset after refresh
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      } else {
        console.warn('❌ Server returned non-200 status');
      }
    } catch (error) {
      console.error('🔥 Delete error:', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
        <Text style={styles.category}>{item.category || 'Uncategorized'}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.amount}>- ₹{item.amount || 0}</Text>
        <Pressable onPress={() => deleteTransaction(item._id)} style={({ pressed }) => ({ marginTop: 6, opacity: pressed ? 0.5 : 1 })}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', padding: 16 }}>
      {/* Title & Refresh Button */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Recent Transactions</Text>
        <Pressable onPress={() => { setRefreshing(true); fetchTransactions(); }}>
          <Ionicons name="refresh" size={24} color="#6366F1" />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
      ) : transactions.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#999', fontSize: 14 }}>
          No transactions available.
        </Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => item?._id || index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTransactions(); }} />
          }
        />
      )}
    </View>
  );
};

const styles = {
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  name: { fontSize: 16, fontWeight: '600', color: '#111' },
  category: { fontSize: 13, color: '#666' },
  date: { fontSize: 12, color: '#999' },
  amount: { color: '#dc2626', fontSize: 16, fontWeight: 'bold' },
};

export default TransactionsScreen;
