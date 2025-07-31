// frontend/screens/home/HomeScreen.js

import React from 'react'; // Removed useEffect as it's no longer needed here
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './home/DashboardScreen';
import TransactionsScreen from './home/TransactionsScreen';
// We no longer import startSmsListener or stopSmsListener
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  // ✅ All useEffects related to starting/stopping the SMS listener have been removed.
  // Your main App.js file now handles this globally with the useSmsListener hook.

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
    </Tab.Navigator>
  );
}
