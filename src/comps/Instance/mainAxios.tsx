import axios from "axios";
import { refreshToken, token} from "../../app/Localstorage";

// Create Axios instance
const mainAxios = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Flag to avoid multiple refresh calls at once
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// RESPONSE INTERCEPTOR
mainAxios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Handle expired token (401) only once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return mainAxios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}login/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const newAccessToken = response.data.access;

        // Store the new token using your local storage handler
        localStorage.setItem("authToken", newAccessToken);
        console.log(newAccessToken)
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return mainAxios(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", localStorage.getItem("authToken"));
        processQueue(err, null);
        localStorage.setItem("redirectPath", window.location.pathname);
        // window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// REQUEST INTERCEPTOR
mainAxios.interceptors.request.use(
  config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default mainAxios;
