import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (
    import.meta.env.DEV
      ? "http://localhost:5000/api"
      : "https://library-management-system-o0vl.onrender.com/api"
  ),
});

API.interceptors.request.use((config) => {
  console.log(`[Frontend] Sending ${config.method.toUpperCase()} request to ${config.url || '/'}`);
  return config;
});

API.interceptors.response.use(
  (response) => {
    console.log(`[Frontend] Received ${response.status} response from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[Frontend] API Error:`, error);
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;