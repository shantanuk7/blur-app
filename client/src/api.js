import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is for an expired/invalid token
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Remove the token from local storage
      localStorage.removeItem('token');
      // Redirect to the login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;