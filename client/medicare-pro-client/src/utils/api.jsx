// import axios from "axios";

// // Create a custom Axios instance
// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// // Request interceptor: Automatically attaches token from localStorage to every request
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor: Handles invalid/expired tokens globally
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (
//       error.response &&
//       (
//         error.response.status === 401 ||
//         error.response.data?.message === "Invalid or expired token"
//       )
//     ) {
//       localStorage.removeItem("token"); // Remove the bad token
//       window.location.href = "/login";  // Redirect to login route
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;





import axios from "axios";

// Create a custom Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor: Automatically attaches token from localStorage to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handles invalid/expired tokens globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (
        error.response.status === 401 ||
        error.response.data?.message === "Invalid or expired token"
      )
    ) {
      localStorage.removeItem("token"); // Remove invalid token
      window.location.href = "/login";  // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;
