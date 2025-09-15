import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext.jsx";

const PublicRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(AuthContext);

  // If user is already logged in, redirect based on their role
  if (isLoggedIn) {
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/dashboard" replace />;
      case 'doctor':
        return <Navigate to="/appointments" replace />;
      case 'patient':
        return <Navigate to="/my-appointments" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If not logged in, allow access to public routes like signin/signup
  return children;
};

export default PublicRoute;
