import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { setAuthToken } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');

      if (token && userData) {
        setAuthToken(token);
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error('Failed to load auth data', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrPhone, password) => {
    try {
      const response = await apiClient.post('/login', {
        [emailOrPhone.includes('@') ? 'email' : 'phone']: emailOrPhone,
        password,
      });

      const { access_token, user: userData } = response.data;
      
      await AsyncStorage.setItem('auth_token', access_token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      
      setAuthToken(access_token);
      setUser(userData);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (e) {
      console.error('Logout failed on server', e);
    } finally {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      setAuthToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
