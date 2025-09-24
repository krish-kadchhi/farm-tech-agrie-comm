// API Configuration for different environments
// To use deployed backend, set VITE_API_URL in your .env.local file
// Example: VITE_API_URL=https://farm-tech-backend.onrender.com
const API_BASE_URL = 'https://farm-tech-agrie-comm.onrender.com'
  //  const API_BASE_URL = 'http://localhost:8080'
// Log the API URL being used for debugging
console.log('API Base URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    EDIT_PROFILE: `${API_BASE_URL}/auth/edit-profile`,
    GET_ALL_USERS: `${API_BASE_URL}/auth/get-all-users`
  },
  ITEMS: {
    GET_ALL: `${API_BASE_URL}/item/get-all-items`,
    ADD: `${API_BASE_URL}/item/add-item`,
    UPDATE: `${API_BASE_URL}/item/update-item`,
    DELETE: `${API_BASE_URL}/item/delete-item`
  },
  CART: {
    GET: `${API_BASE_URL}/cart/get-cart`,
    ADD: `${API_BASE_URL}/cart/add-to-cart`,
    UPDATE: `${API_BASE_URL}/cart/update-cart`,
    DELETE: `${API_BASE_URL}/cart/delete-from-cart`,
    CLEAR: `${API_BASE_URL}/cart/clear-cart`
  },
  ORDERS: {
    GET_ALL: `${API_BASE_URL}/orders/get-all-orders`,
    CREATE: `${API_BASE_URL}/orders/create-order`,
    UPDATE: `${API_BASE_URL}/orders/update-order`
  },
  PAYMENT: {
    CREATE_ORDER: `${API_BASE_URL}/payment/create-order`,
    VERIFY: `${API_BASE_URL}/payment/verify-payment`
  }
};

export default API_BASE_URL;
