import { useContext } from "react";
import { AuthContext } from "../contex/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-3 flex items-center z-50">
      {/* Logo Left */}
      <div className="flex items-center space-x-3">
        <div className="bg-cyan-600 text-white w-9 h-9 flex items-center justify-center rounded-full font-bold">
          M
        </div>
        <h1 className="text-xl font-bold text-gray-800">
          Medicare <span className="text-cyan-600">Pro</span>
        </h1>
      </div>

      {/* Centered Links */}
      <div className="flex-1 flex justify-center">
        <div className="hidden md:flex space-x-6">
          {/* Role-based links */}
          {user?.role === "admin" && (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-cyan-600">Dashboard</Link>
              <Link to="/patients" className="text-gray-700 hover:text-cyan-600">Patients</Link>
              <Link to="/appointments" className="text-gray-700 hover:text-cyan-600">Appointments</Link>
              <Link to="/doctors" className="text-gray-700 hover:text-cyan-600">Doctors</Link>
              <Link to="/profile" className="text-gray-700 hover:text-cyan-600">Profile</Link>
            </>
          )}

          {user?.role === "doctor" && (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-cyan-600">Dashboard</Link>
              <Link to="/patients" className="text-gray-700 hover:text-cyan-600">Patients</Link>
              <Link to="/appointments" className="text-gray-700 hover:text-cyan-600">Appointments</Link>
              <Link to="/profile" className="text-gray-700 hover:text-cyan-600">Profile</Link>
            </>
          )}

          {user?.role === "patient" && (
            <>
              <Link to="/my-appointments" className="text-gray-700 hover:text-cyan-600">My Appointments</Link>
              <Link to="/profile" className="text-gray-700 hover:text-cyan-600">Profile</Link>
            </>
          )}
        </div>
      </div>

      {/* Sign In/Out Right */}
      <div className="hidden md:flex items-center space-x-3">
        {isLoggedIn ? (
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"

          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/signin"
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
