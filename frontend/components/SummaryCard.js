// frontend/components/SummaryCard.js
import React from 'react';
import { View, Text, Platform } from 'react-native';

const SummaryCard = ({ category, total }) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...(Platform.OS === 'web'
          ? { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
          : {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 3,
            }),
      }}
    >
      <Text style={{ fontSize: 15 }}>{category}</Text>
      <Text style={{ fontWeight: 'bold', color: '#dc2626' }}>₹{total}</Text>
    </View>
  );
};

export default SummaryCard;
