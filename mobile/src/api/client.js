import axios from 'axios';
import Constants from 'expo-constants';

// --- CONFIGURATION ---
const IS_EMULATOR = false; // Set to false for production APK
const PC_IP = '192.168.29.107'; 

const API_BASE_URL = IS_EMULATOR 
  ? 'http://10.0.2.2:8001/api' 
  : 'https://api.businesstradecore.in/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;
