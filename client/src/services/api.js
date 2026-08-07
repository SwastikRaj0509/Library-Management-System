import axios from "axios";

const API = axios.create({
  baseURL: "https://library-management-system-o0vl.onrender.com/api",
});

export default API;