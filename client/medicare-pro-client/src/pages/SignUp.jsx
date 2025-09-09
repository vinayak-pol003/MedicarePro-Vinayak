  // pages/CreateAccount.jsx
  import { useState } from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
  import bgImage from '../assets/bg.png'; // Ensure the path is correct

  export default function SignUp() {
    const location = useLocation();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState(location.state?.email || "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("doctor");

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
          navigate("/signin");
        } else {
          alert(data.message || "Signup failed");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong!");
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center"
            style={{ backgroundImage: `url(${ bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
        <div className="flex w-full h-full items-center justify-between bg-opacity-50 ">  
          {/* Left Panel */}
          <div className="flex flex-col justify-center w-1/2 px-16 text-black">
                    <h1 className="text-5xl font-bold mb-4">Welcome, Join Us</h1>
                    <p className="mb-6">
                      Create your Medicare account to manage your health, book appointments, and connect with trusted providers—all in one place.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#"><FaFacebookF size={24} /></a>
                      <a href="#"><FaTwitter size={24} /></a>
                      <a href="#"><FaInstagram size={24} /></a>
                      <a href="#"><FaYoutube size={24} /></a>
                    </div>
          </div>

      <div className="flex items-center justify-center min-h-screen px-50 width-full">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Create Account
          </h1>
          <form className="mt-6 space-y-4" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
            <div>
              <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            <p className="text-gray-500 px-2 text-xs">At least 8 characters must be entered.</p>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              <option value="patient">Patient</option>
            </select>
            <div className="flex items-center space-x-2 ">
                  <input type="checkbox" id="remember-terms" />
                  <label htmlFor="remember-terms" className="text-gray-600 text-sm">
                    I agree to the Terms of Service for this website.
                  </label>
            </div>
            <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember-consent" />
                  <label htmlFor="remember-consent" className="text-gray-600 text-sm">
                    I consent to my information being used for Medicare healthcare services.
                  </label>
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
      </div>
      </div>
    );
  }
