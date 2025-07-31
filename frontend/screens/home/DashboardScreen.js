// frontend/screens/home/DashboardScreen.js

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

import { BASE_URL } from '../../utils/config';
import StatCard from '../../components/StatCard';
import SummaryCard from '../../components/SummaryCard';
import TransactionList from '../../components/TransactionList';
import FloatingAddButton from '../../components/FloatingAddButton';

const DashboardScreen = () => {
  const userId = '661effd822f4caa445d33c56';
  const navigation = useNavigation();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // ✅ Corrected month/year to default current
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/transactions/${userId}`);
      setTransactions(res.data);
    } catch (err) {
      console.error('❌ Error fetching transactions:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];

    return transactions.filter((transaction) => {
      if (!transaction || !transaction.date) return false;

      const txDate = new Date(transaction.date);

      const txMonth = txDate.getUTCMonth();       // Jan = 0
      const txYear = txDate.getUTCFullYear();

      console.log("Filtering:", {
        name: transaction.name,
        txMonth,
        selectedMonth,
        txYear,
        selectedYear
      });

      return (
        txMonth === Number(selectedMonth) &&
        txYear === Number(selectedYear)
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totalSpend = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [filteredTransactions]);

  const averageSpend = useMemo(() => {
    return filteredTransactions.length > 0
      ? (totalSpend / filteredTransactions.length).toFixed(2)
      : 0;
  }, [filteredTransactions, totalSpend]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    filteredTransactions.forEach((tx) => {
      const cat = tx.category || 'Uncategorized';
      totals[cat] = (totals[cat] || 0) + tx.amount;
    });
    return totals;
  }, [filteredTransactions]);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Hi VK 👋</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Ionicons name="refresh" size={24} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          {/* Month Picker */}
          <View style={{
            width: '48%',
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
            paddingHorizontal: 4,
            overflow: 'hidden'
          }}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemIndex)}
              style={{ color: '#333' }}
            >
              {months.map((month, index) => (
                <Picker.Item key={index} label={month} value={index} />
              ))}
            </Picker>
          </View>

          {/* Year Picker */}
          <View style={{
            width: '48%',
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
            paddingHorizontal: 4,
            overflow: 'hidden'
          }}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(val) => setSelectedYear(val)}
              style={{ color: '#333' }}
            >
              {[2023, 2024, 2025].map((y) => (
                <Picker.Item key={y} label={y.toString()} value={y} />
              ))}
            </Picker>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Stat Cards */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <StatCard title="Total Spend" value={`₹${totalSpend}`} bgColor="#facc15" />
              <StatCard title="Avg. Spend" value={`₹${averageSpend}`} bgColor="#34d399" />
            </View>

            {/* Category Summary */}
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Top Categories</Text>
            {Object.keys(categoryTotals).length === 0 ? (
              <Text style={{ fontSize: 14, color: '#999' }}>No data for this month.</Text>
            ) : (
              Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([cat, amt]) => (
                  <SummaryCard key={cat} category={cat} total={amt} />
                ))
            )}

            {/* Transactions */}
            <View style={{ marginHorizontal: 0, marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                Transactions in {months[selectedMonth]} {selectedYear}
              </Text>

              {filteredTransactions.length === 0 ? (
                <Text>No transactions for selected month.</Text>
              ) : (
                filteredTransactions.map((item) => (
                  <View
                    key={item._id}
                    style={{
                      marginBottom: 10,
                      padding: 10,
                      backgroundColor: '#f1f1f1',
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                    <Text>₹{item.amount}</Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* ✅ Floating Add Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          backgroundColor: '#6366F1',
          padding: 16,
          borderRadius: 50,
          elevation: 5,
        }}
        onPress={() => navigation.navigate('AddExpenseModal')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;
