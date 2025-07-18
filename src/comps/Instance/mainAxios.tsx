import axios from "axios";
import { token } from "../../app/Localstorage";

const mainAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
  headers: {
    
    "Content-Type": "application/json",
    Accept: "application/json",
    // Add any other default headers here
  },
});

mainAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes("/login")) {
      // Store the current location to return after login
      localStorage.setItem("redirectPath", window.location.pathname);
      // Redirect to login page
      window.location.href = "/login";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// Optional: Add request interceptor for auth token if needed
mainAxios.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default mainAxios;