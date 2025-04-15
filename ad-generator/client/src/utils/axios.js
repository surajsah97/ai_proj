import axios from 'axios';

// Create an axios instance with custom config
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 30000, // Increase timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor
instance.interceptors.request.use(
  config => {
    // You can modify the request config here
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.log('Request timed out');
      // You could implement automatic retry logic here
    }
    
    return Promise.reject(error);
  }
);

export default instance;