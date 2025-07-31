// frontend/components/StatCard.js
import React from 'react';
import { View, Text, Platform } from 'react-native';

const StatCard = ({ title, value, bgColor }) => {
  return (
    <View
      style={{
        backgroundColor: bgColor || '#fff',
        borderRadius: 10,
        padding: 14,
        marginRight: 8,
        width: '48%',
        ...(Platform.OS === 'web'
          ? { shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2
            }
          : {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 4,
            }),
      }}
    >
      <Text style={{ fontSize: 14, color: '#444' }}>{title}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>{value}</Text>
    </View>
  );
};

export default StatCard;
