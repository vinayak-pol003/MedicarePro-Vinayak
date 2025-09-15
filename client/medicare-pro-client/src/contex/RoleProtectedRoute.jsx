import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext.jsx";

const RoleProtectedRoute = ({ children, allowedRoles, redirectPath = "/" }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const location = useLocation();

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If logged in but wrong role, redirect to appropriate page
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect based on their actual role
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/dashboard" replace />;
      case 'doctor':
        return <Navigate to="/appointments" replace />;
      default:
        return <Navigate to={redirectPath} replace />;
    }
  }

  // If user has correct role, render the component
  return children;
};

export default RoleProtectedRoute;
