import {API_URL as PROD_URL, API_URL_ANDROID, API_URL_IOS, STAGE} from '@env';
import axios from 'axios';
import {Platform} from 'react-native';
import {StorageAdapter} from '../adapters/storage-adapter';

export const API_URL =
  STAGE === 'production'
    ? PROD_URL
    : Platform.OS === 'ios'
    ? API_URL_IOS
    : 'http://192.168.222.169:3000/api';
const tesloApi = axios.create({
  baseURL: 'http://192.168.222.169:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors
tesloApi.interceptors.request.use(async config => {
  const token = await StorageAdapter.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export {tesloApi};
