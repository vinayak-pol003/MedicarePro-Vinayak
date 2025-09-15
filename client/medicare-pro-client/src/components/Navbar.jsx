import { useContext, useState } from "react";
import { AuthContext } from "../contex/AuthContext.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Define links for easy composition
  const publicLinks = (
    <>
      <Link to="/" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Home</Link>
      <Link to="/aboutus" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>About Us</Link>
      <Link to="/contactus" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Contact Us</Link>
    </>
  );

  const patientLinks = (
    <>
      <Link to="/my-appointments" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>My Appointments</Link>
      <Link to="/profile" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Profile</Link>
    </>
  );

  const publicRoutes = ["/", "/aboutus", "/contactus", "/signin", "/signup"];
  const isPublicPage = publicRoutes.includes(location.pathname);

  const handleSignOut = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-3 flex items-center justify-between z-50">
      {/* Logo Left */}
      <div className="flex items-center space-x-3">
        <div className="bg-cyan-600 text-white w-9 h-9 flex items-center justify-center rounded-full font-bold">
          <Link to={"/"}>M</Link>
        </div>
        <h1 className="text-xl font-bold text-gray-800">
          Medicare <span className="text-cyan-600">Pro</span>
        </h1>
      </div>

      {/* Desktop Links */}
      <div className="flex-1 flex justify-center">
        <div className="hidden md:flex space-x-6 items-center">
          {(isPublicPage || (["patient", "doctor"].includes(user?.role) && isLoggedIn)) && (
            <>
              {publicLinks}
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/patients" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Patients</Link>
              <Link to="/appointments" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Appointments</Link>
              <Link to="/doctors" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Doctors</Link>
              <Link to="/profile" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Profile</Link>
            </>
          )}

          {user?.role === "doctor" && (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/patients" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Patients</Link>
              <Link to="/appointments" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Appointments</Link>
              <Link to="/profile" className="text-gray-700 hover:text-cyan-600" onClick={() => setMenuOpen(false)}>Profile</Link>
            </>
          )}

          {user?.role === "patient" && isLoggedIn && (
            <>
              {patientLinks}
            </>
          )}
        </div>
      </div>

      {/* Desktop Sign In/Out Right */}
      <div className="hidden md:flex items-center space-x-3">
        {/* Vertical line divider */}
        <span className="inline-block h-8 w-1 bg-gray-700"></span>
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
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
        )}
      </div>


      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          type="button"
          className="text-cyan-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 8h22M4 16h22M4 24h22" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 bg-white bg-opacity-95 flex flex-col items-center justify-start space-y-6 py-6 md:hidden z-50 shadow-lg">
          {(isPublicPage || (["patient", "doctor"].includes(user?.role) && isLoggedIn)) && (
            <>
              {publicLinks}
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">Dashboard</Link>
              <Link to="/patients" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">Patients</Link>
              <Link to="/appointments" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">Appointments</Link>
              <Link to="/doctors" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">Doctors</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">Profile</Link>
            </>
          )}

          {user?.role === "doctor" && (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">Dashboard</Link>
              <Link to="/patients" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">Patients</Link>
              <Link to="/appointments" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">Appointments</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">Profile</Link>
            </>
          )}

          {user?.role === "patient" && isLoggedIn && (
            <>
              <Link to="/my-appointments" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">My Appointments</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-cyan-600 text-lg">Profile</Link>
            </>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-lg"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/signin"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
