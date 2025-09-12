import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext.jsx";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import bgImage from "../assets/bg.png";
import FadeInSection from "../utils/Fade.jsx";

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
        login(data.token, data.role);

        if (data.role === "admin" || data.role === "doctor") {
          navigate("/dashboard");
        } else {
          navigate("/my-appointments");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
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
            <a href="#"><FaFacebookF size={24} /></a>
            <a href="#"><FaTwitter size={24} /></a>
            <a href="#"><FaInstagram size={24} /></a>
            <a href="#"><FaYoutube size={24} /></a>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-4 sm:p-8 w-full max-w-sm sm:max-w-md mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
              Sign in
            </h1>
            <form className="space-y-2 sm:space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember-signin" />
                <label htmlFor="remember-signin" className="text-gray-600 text-sm">
                  Remember Me
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-700"
                }`}
              >
                {loading ? "Signing In..." : "Sign in now"}
              </button>
              <div className="w-full">
                <Link
                  to="/signup"
                  className="block w-full py-2 rounded-lg text-white text-center bg-cyan-600 hover:bg-cyan-700 transition mt-2"
                >
                  Create Account
                </Link>
              </div>
            </form>
            <div className="mt-4 flex justify-between items-center text-sm">
              <a href="#" className="text-cyan-600 hover:underline">
                Lost your password?
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-600 text-center">
              By clicking on "Sign in now" you agree to{" "}
              <a href="#" className="underline">Terms of Service</a>{" "}
              | <a href="#" className="underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
