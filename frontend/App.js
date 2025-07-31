// frontend/App.js

import { StyleSheet, Platform, PermissionsAndroid, Alert } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import useSmsListener from './hooks/useSmsListener';

import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';

import { AuthProvider, AuthContext } from './context/AuthContext';
import { BASE_URL } from './utils/config';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import StockInvestmentsScreen from './screens/StockInvestmentsScreen';
import AIInsightsScreen from './screens/AIInsightsScreen';
import AddExpenseModal from './screens/modals/AddExpenseModal';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// We no longer need the addExpenseFromNotification function here,
// as all additions will now go through the modal.

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function MainApp() {
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useNavigationContainerRef();
  const [isReadyForSms, setIsReadyForSms] = useState(false);

  useSmsListener(isReadyForSms);

  useEffect(() => {
    const setupApp = async () => {
      // ✅ FIX 1: Define a simpler interactive category.
      // We removed the text input and changed the button title.
      await Notifications.setNotificationCategoryAsync('expense_actions_modal', [
        {
          identifier: 'open_modal',
          buttonTitle: 'Add Details', // More descriptive button
          options: {
            opensAppToForeground: true, // This is now required to open the modal
          },
        },
        {
          identifier: 'dismiss',
          buttonTitle: 'Dismiss',
          options: {
            destructive: true,
            opensAppToForeground: false,
          },
        },
      ]);
      console.log('✅ Notification category set for opening modal');

      // ... (Permission requests remain the same)
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Notifications will not work.');
      }
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        ]);
        const readSmsGranted = granted[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.GRANTED;
        const receiveSmsGranted = granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED;
        if (readSmsGranted && receiveSmsGranted) {
          setIsReadyForSms(true);
        }
      } else {
          setIsReadyForSms(true);
      }
    };
    setupApp();
  }, []);

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      const actionIdentifier = response.actionIdentifier;

      // ✅ FIX 2: Both the main tap AND the "Add Details" button now do the same thing.
      if (actionIdentifier === 'open_modal' || actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        console.log('User wants to open the modal to add details.');
        if (data?.amount) {
          // Use a slight delay to ensure the app has time to open before navigating
          setTimeout(() => {
            navigationRef.navigate('AddExpenseModal', {
              amount: data.amount,
              name: data.name,
              date: data.date,
            });
          }, 500);
        }
      }
    });
    return () => subscription.remove();
  }, []);

  if (isLoading) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Main' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="AddExpenseModal"
              component={AddExpenseModal}
              options={{ presentation: 'modal', headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ... MainTabs and styles remain the same
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <FontAwesome5 name="home" size={size} color={color} />;
            case 'Insights':
              return <MaterialIcons name="insights" size={size} color={color} />;
            case 'Investments':
              return <Feather name="trending-up" size={size} color={color} />;
            case 'Profile':
              return <Ionicons name="person" size={size} color={color} />;
            default:
              return null;
          }
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Insights" component={AIInsightsScreen} />
      <Tab.Screen name="Investments" component={StockInvestmentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
