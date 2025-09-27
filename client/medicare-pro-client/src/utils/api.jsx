import axios from "axios";
import { io } from "socket.io-client";

// API Configuration
const API_BASE_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

// Create a custom Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
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
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: Handles invalid/expired tokens globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Response Error:", error);
    
    if (
      error.response &&
      (
        error.response.status === 401 ||
        error.response.data?.message === "Invalid or expired token"
      )
    ) {
      localStorage.removeItem("token"); // Remove invalid token
      localStorage.removeItem("user");  // Also remove user data
      window.location.href = "/login";  // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Socket.io client setup with proper configuration and error handling
let socket = null;

// Initialize Socket.IO connection only when needed
export const initSocket = () => {
  if (!socket) {
    try {
      socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'], // Use both transports for fallback
        timeout: 20000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 3,
        maxReconnectionAttempts: 3,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5,
        forceNew: false,
        autoConnect: false, // Don't auto-connect immediately
      });

      // Connection event handlers
      socket.on('connect', () => {
        console.log('✅ Socket connected successfully:', socket.id);
      });

      socket.on('connect_error', (error) => {
        console.warn('⚠️ Socket connection error:', error.message);
        // Don't throw errors, just log them
      });

      socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      });

      socket.on('reconnect_error', (error) => {
        console.warn('❌ Socket reconnection failed:', error.message);
      });

      socket.on('reconnect_failed', () => {
        console.error('💥 Socket failed to reconnect after maximum attempts');
      });

    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }
  return socket;
};

// Get existing socket instance
export const getSocket = () => {
  return socket;
};

// Connect socket manually
export const connectSocket = () => {
  if (!socket) {
    initSocket();
  }
  if (socket && !socket.connected) {
    socket.connect();
  }
  return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    console.log('🔌 Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
};

// Emit event with error handling
export const emitSocketEvent = (event, data) => {
  if (socket && socket.connected) {
    socket.emit(event, data);
  } else {
    console.warn('Socket not connected. Cannot emit event:', event);
  }
};

// Listen to socket events
export const onSocketEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  } else {
    console.warn('Socket not initialized. Cannot listen to event:', event);
  }
};

// Remove socket event listener
export const offSocketEvent = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};

// Check if socket is connected
export const isSocketConnected = () => {
  return socket && socket.connected;
};

// Socket authentication (call this after user login)
export const authenticateSocket = (token) => {
  if (socket && socket.connected) {
    socket.emit('authenticate', { token });
  }
};

// Export default API instance
export default API;

// Export socket utilities
export {
  socket, // Keep this for backward compatibility, but prefer using the functions above
};

// Utility function to handle API errors consistently
export const handleApiError = (error, customMessage = "An error occurred") => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error || customMessage;
    
    console.error(`API Error ${status}:`, message);
    return { status, message };
  } else if (error.request) {
    // Request made but no response received
    console.error('Network Error:', error.request);
    return { status: 0, message: "Network error. Please check your connection." };
  } else {
    // Something else happened
    console.error('Error:', error.message);
    return { status: -1, message: error.message || customMessage };
  }
};

// Environment-specific configurations
export const CONFIG = {
  API_BASE_URL,
  SOCKET_URL,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
