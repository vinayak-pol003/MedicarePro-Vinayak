import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTrash, FaUser } from "react-icons/fa";
import bgImage from '../assets/bg.png';
import FadeInSection from "../utils/Fade";
import { AuthContext } from "../contex/AuthContext.jsx";

export default function AddAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  
  // New states for admin management
  const [showAdminList, setShowAdminList] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [adminError, setAdminError] = useState("");

  // Toggle admin list visibility and fetch admins
  const handleToggleAdminList = async () => {
    if (!showAdminList) {
      // Fetch admins when opening the list
      await fetchAdmins();
    }
    setShowAdminList(!showAdminList);
  };

  // Fetch all admin users
  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      setAdminError("");
      
      const token = localStorage.getItem("token");
      if (!token) {
        setAdminError("No authentication token found");
        return;
      }

      const res = await fetch("http://localhost:5000/api/users", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Filter only admin users
      const adminUsers = data.filter(u => u.role === "admin");
      setAdmins(Array.isArray(adminUsers) ? adminUsers : []);
      
    } catch (err) {
      console.error("Error fetching admins:", err);
      setAdminError("Failed to load admin users");
    } finally {
      setLoadingAdmins(false);
    }
  };

  // Delete admin user
  const handleDeleteAdmin = async (adminId, adminName, adminEmail) => {
    // Prevent super admin from deleting themselves
    if (adminEmail === "chand@gmail.com") {
      alert("Cannot delete the super admin account!");
      return;
    }

    const confirmMessage = `Are you sure you want to delete admin "${adminName}"?\n\nThis action cannot be undone.`;
    if (!window.confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`http://localhost:5000/api/users/${adminId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Update the local state by removing the deleted admin
      setAdmins(prev => prev.filter(admin => admin._id !== adminId));
      alert(`Successfully deleted admin: ${adminName}`);
      
    } catch (err) {
      console.error("Error deleting admin:", err);
      alert(`Failed to delete admin. Error: ${err.message}`);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok || res.status === 201) {
        alert("Account created successfully!");
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        // Refresh admin list if it's currently shown
        if (showAdminList) {
          await fetchAdmins();
        }
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <FadeInSection>
      <div
        className="min-h-screen flex flex-col lg:flex-row items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Left Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 py-12 text-black text-center lg:text-left">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
            Welcome to Admin Control
          </h1>
          <p className="mb-6 text-base sm:text-lg max-w-lg mx-auto lg:mx-0">
            Empower your healthcare team with advanced administrative tools to manage users, 
            configure system settings, and ensure optimal platform performance across all departments.
          </p>
          
          <div className="flex flex-col justify-center lg:justify-start space-y-4">
            {/* Social media icons row */}
            <div className="flex justify-center lg:justify-start space-x-4">
              <a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors">
                <FaFacebookF size={24} />
              </a>   
              <a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors">
                <FaYoutube size={24} />
              </a>
            </div>
            
            {/* Conditionally render button only for chand@gmail.com */}
            {user?.email === "chand@gmail.com" && (
              <div className="flex flex-col justify-center lg:justify-start space-y-4">
                <button 
                  onClick={handleToggleAdminList}
                  className="bg-cyan-600 text-white px-6 py-3 rounded-md hover:bg-cyan-700 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  {showAdminList ? "Hide Admin List" : "Manage Admins"}
                </button>

                {/* Admin List Dropdown */}
                {/* Admin List Dropdown - Minimal Modern */}
                    {showAdminList && (
                    <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md mx-auto lg:mx-0 max-h-80 overflow-y-auto border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Admin Users
                        </h3>
                        <span className="bg-cyan-100 text-cyan-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {admins.length} total
                        </span>
                        </div>
                        
                        {loadingAdmins ? (
                        <div className="flex flex-col items-center py-8 space-y-4">
                            <div className="w-8 h-8 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500 text-sm">Loading admins...</p>
                        </div>
                        ) : adminError ? (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <p className="text-red-700 text-sm">{adminError}</p>
                        </div>
                        ) : admins.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUser className="text-gray-300" size={28} />
                            </div>
                            <h4 className="text-gray-600 font-medium mb-2">No admin users</h4>
                            <p className="text-gray-400 text-sm">Create your first admin account above</p>
                        </div>
                        ) : (
                        <div className="space-y-1">
                            {admins.map((admin, index) => (
                            <div key={admin._id} className="group p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-150">
                                <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-medium text-sm">
                                        {admin.name?.charAt(0).toUpperCase() || 'A'}
                                        </span>
                                    </div>
                                    {admin.email === "chand@gmail.com" && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
                                    )}
                                    </div>
                                    
                                    <div className="min-w-0 flex-1">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-gray-900 font-medium text-sm truncate">
                                        {admin.name}
                                        </p>
                                        {admin.email === "chand@gmail.com" && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-md font-medium">
                                            Super Admin
                                        </span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-xs truncate">{admin.email}</p>
                                    </div>
                                </div>
                                
                                {admin.email !== "chand@gmail.com" && (
                                    <button
                                    onClick={() => handleDeleteAdmin(admin._id, admin.name, admin.email)}
                                    className="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white p-2 rounded-lg transition-all duration-200"
                                    title="Delete Admin"
                                    >
                                    <FaTrash size={14} />
                                    </button>
                                )}
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                    )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center w-full lg:w-1/2 py-12">
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-sm mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2 sm:mb-6">
              Create Admin Account
            </h1>
            <form className="mt-2 sm:mt-6 space-y-3 sm:space-y-4" onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
              />
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                  className="w-full border border-gray-300 px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
                />
                <p className="text-gray-500 px-2 text-xs mt-1">
                  At least 8 characters must be entered.
                </p>
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent bg-white"
              >
                <option value="admin">Admin</option>
              </select>
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  id="remember-terms" 
                  required
                  className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-terms" className="text-gray-600 text-sm leading-relaxed">
                  I agree to the Terms of Service for this website.
                </label>
              </div>
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  id="remember-consent" 
                  required
                  className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-consent" className="text-gray-600 text-sm leading-relaxed">
                  I consent to my information being used for Medicare healthcare services.
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Create Admin Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}

