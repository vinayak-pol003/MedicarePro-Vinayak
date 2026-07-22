import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // pulls from .env
  withCredentials: true, // if you’re handling cookies/auth
});

export default API;
