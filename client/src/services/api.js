import axios from "axios";

const API = axios.create({
  baseURL: "https://library-management-system-o0vl.onrender.com/api",
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
    return Promise.reject(error);
  }
);

export default API;