// frontend/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ❌ The old import was: import jwtDecode from 'jwt-decode';
// ✅ This is the correct "named" import for modern versions of the library.
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // This will now work correctly.
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          setIsAuthenticated(true);
        } else {
          // Token is expired
          await AsyncStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } else {
        // No token found
        setIsAuthenticated(false);
      }
    } catch (error) {
      // This catch block will handle errors like an invalid token format
      console.error('Error checking token:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
