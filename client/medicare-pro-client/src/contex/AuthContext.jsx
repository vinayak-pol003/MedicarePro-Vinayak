import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        console.warn("Token expired");
        logout();
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);
      // Include the raw token in the user object
      setUser({ token, role: decoded.role, ...decoded });
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Invalid token", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          logout();
        } else {
          setUser({ token, role: decoded.role, ...decoded });
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Invalid token", err);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
