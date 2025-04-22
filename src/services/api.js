import axios from 'axios';

const API_URL = 'https://aviralv.app.n8n.cloud/webhook/4b812275-4ff0-42a6-a897-2c8ad444a1e1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 429:
          // Handle rate limiting
          console.error('Rate limit exceeded. Please try again later.');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// Input sanitization
const sanitizeInput = (text) => {
  // Remove HTML tags
  const sanitized = text.replace(/<[^>]+>/g, '');
  // Remove potentially dangerous characters
  return sanitized.replace(/[<>{}[\]\\]/g, '');
};

// Rate limiting
const rateLimit = {
  lastRequest: 0,
  minInterval: 1000, // 1 second between requests
};

const checkRateLimit = () => {
  const now = Date.now();
  if (now - rateLimit.lastRequest < rateLimit.minInterval) {
    throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
  }
  rateLimit.lastRequest = now;
};

export const generateRecipes = async (ingredients) => {
  try {
    checkRateLimit();
    
    // Validate and sanitize input
    if (!ingredients || ingredients.length < 3) {
      throw new Error('Please provide at least 3 ingredients.');
    }
    
    const sanitizedIngredients = sanitizeInput(ingredients);
    
    const response = await api.post('', {
      ingredients: sanitizedIngredients
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/token', {
      username,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export default api; 