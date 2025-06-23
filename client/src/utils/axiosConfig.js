// src/utils/axiosConfig.js
import axios from "axios";

const token = localStorage.getItem("token");

export const baseURL = "http://localhost:5000/api";

export const base = "http://localhost:5000/";

// Create an axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your server URL
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token"); // Ensure the token is stored in localStorage
    if (token) {
      // Set the token in the request headers
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
