import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext.jsx";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import bgImage from "../assets/bg.png";
import FadeInSection from "../utils/Fade.jsx";
import toast from 'react-hot-toast';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const res = await fetch("http://localhost:5000/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.status === 404) {
      navigate("/signup", { state: { email } });
    } else if (res.ok) {
      // Set the context first
      login(data.token, data.role);

      // Small delay to ensure context is updated
      setTimeout(() => {
        // Role-based redirect with replace: true to avoid history issues
        if (data.role === "admin") {
          navigate("/dashboard", { replace: true });
        } else if (data.role === "doctor") {
          navigate("/doctors-dashboard", { replace: true });
        } else {
          navigate("/my-appointments", { replace: true });
        }
      }, 100); // 100ms delay

      toast.success(`Welcome back! Redirecting to your ${data.role} dashboard...`);
    } else {
      toast.error(data.message || "Login failed. Please check your credentials.");
    }
  } catch (err) {
    console.error("Login error:", err);
    toast.error("Something went wrong! Please try again.");
  } finally {
    setLoading(false);
  }
};



  return (
    <FadeInSection>
      <div
        className="min-h-screen flex flex-col lg:flex-row items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Left Panel */}
        <div className="w-full lg:w-1/2 px-4 sm:px-16 flex flex-col justify-center text-black text-center lg:text-left mb-8 lg:mb-0 mt-17 sm:mt-24">
          <h1 className="text-2xl sm:text-5xl font-bold mb-4">Welcome Back</h1>
          <p className="mb-6 text-base sm:text-lg">
            Sign in to access your Medicare dashboard, manage appointments, and view your medical records securely.
          </p>
          <div className="flex justify-center lg:justify-start space-x-4">
            <a href="#" aria-label="Facebook">
              <FaFacebookF size={24} className="text-gray-600 hover:text-blue-600 transition-colors" />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter size={24} className="text-gray-600 hover:text-blue-400 transition-colors" />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram size={24} className="text-gray-600 hover:text-pink-600 transition-colors" />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube size={24} className="text-gray-600 hover:text-red-600 transition-colors" />
            </a>
          </div>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-4 sm:p-8 w-full max-w-sm sm:max-w-md mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
              Sign in to Medicare Pro
            </h1>
            
            <form className="space-y-2 sm:space-y-4" onSubmit={handleLogin}>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="remember-signin"
                  className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
                />
                <label htmlFor="remember-signin" className="text-gray-600 text-sm">
                  Remember Me
                </label>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white transition font-medium ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign in now"
                )}
              </button>
              
              <div className="w-full">
                <Link
                  to="/signup"
                  className="block w-full py-2 rounded-lg text-white text-center bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 transition mt-2 font-medium"
                >
                  Create Account
                </Link>
              </div>
            </form>
            
            <div className="mt-4 flex justify-between items-center text-sm">
              <Link 
                to="/forgot-password" 
                className="text-cyan-600 hover:text-cyan-700 hover:underline"
              >
                Lost your password?
              </Link>
            </div>
            
            <p className="mt-4 text-xs text-gray-600 text-center">
              By clicking on "Sign in now" you agree to{" "}
              <Link to="/terms" className="text-cyan-600 hover:underline">
                Terms of Service
              </Link>{" "}
              | <Link to="/privacy" className="text-cyan-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
