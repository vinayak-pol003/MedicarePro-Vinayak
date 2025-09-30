import { useState, useEffect, useContext } from "react";
import axios from "axios";
import bgImage from "../assets/bg.png";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade.jsx";
import imagekit from "../utils/imagekit.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function PatientRequestForm({ onSubmitted }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    doctor_id: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [requestStatus, setRequestStatus] = useState({
    hasRequest: false,
    status: null,
    loading: true
  });

  // Check if user already has a request
  useEffect(() => {
    const checkExistingRequest = async () => {
      if (!user?.token) return;

      try {
        const token = user.token || localStorage.getItem("token") || "";
        const response = await axios.get(`${BASE_URL}/api/patient-requests/my-status`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch((error) => {
          if (error.response?.status === 404) {
            // Route doesn't exist yet, assume no requests
            return { data: { hasRequest: false, status: null } };
          }
          throw error;
        });
        
        setRequestStatus({
          hasRequest: response.data.hasRequest || false,
          status: response.data.status || null,
          loading: false
        });

        if (response.data.hasRequest) {
          setError(`You already have a ${response.data.status} patient registration request.`);
        }
      } catch (err) {
        console.error("Error checking existing request:", err);
        setRequestStatus(prev => ({ ...prev, loading: false }));
      }
    };

    checkExistingRequest();
  }, [user]);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = user?.token || localStorage.getItem("token") || "";
        const response = await axios.get(`${BASE_URL}/api/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setDoctors(response.data || []);
        if (response.data.length > 0 && !formData.doctor_id) {
          setFormData(prev => ({ ...prev, doctor_id: response.data[0]._id }));
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors list");
      }
    };

    if (user?.token) {
      fetchDoctors();
    }
  }, [user?.token, formData.doctor_id]);

  // Auto-fill user data when context loads
  useEffect(() => {
    if (user && (!formData.name || !formData.email)) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user, formData.name, formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (error) setError("");
  };

  // File input handler with image validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      return;
    }

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size must be less than 5MB");
        setImageFile(null);
        return;
      }
      setImageFile(file);
      setError("");
    } else {
      setImageFile(null);
      setError("Please select a valid image (.jpg or .png)");
    }
  };

  // Submit patient registration request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Check if user has existing request
      if (requestStatus.hasRequest && requestStatus.status === "pending") {
        throw new Error("You already have a pending request. Please wait for admin approval.");
      }

      if (requestStatus.status === "approved") {
        throw new Error("Your request has already been approved. You can now book appointments.");
      }

      // Validate required fields
      if (!formData.name.trim() || !formData.doctor_id || !formData.phone.trim()) {
        throw new Error("Name, phone, and doctor selection are required");
      }

      // Phone validation
      if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
        throw new Error("Please enter a valid phone number");
      }

      let imageUrl = "";

      // Upload image if provided
      if (imageFile) {
        try {
          const res = await fetch(`${BASE_URL}/api/imagekit-auth`);
          if (!res.ok) {
            throw new Error("Failed to get image upload credentials");
          }
          const authParams = await res.json();

          imageUrl = await new Promise((resolve, reject) => {
            imagekit.upload(
              {
                file: imageFile,
                fileName: `patient-request-${user?.id || Date.now()}-${Date.now()}-${imageFile.name}`,
                folder: "PatientRequests",
                token: authParams.token,
                signature: authParams.signature,
                expire: authParams.expire,
              },
              (err, result) => {
                if (err) {
                  console.error("ImageKit upload error:", err);
                  reject(err.message || "Image upload failed");
                } else {
                  resolve(result.url);
                }
              }
            );
          });
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          throw new Error("Image upload failed. Please try again or proceed without an image.");
        }
      }

      const token = user?.token || localStorage.getItem("token") || "";
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || user?.email,
        phone: formData.phone.trim(),
        description: formData.description.trim(),
        doctor_id: formData.doctor_id,
        image: imageUrl
      };

      console.log("Submitting patient request:", { ...payload, image: imageUrl ? "uploaded" : "none" });

      const apiRes = await axios.post(`${BASE_URL}/api/patient-requests`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setSuccess("Patient registration request submitted successfully! You will be notified once an admin reviews your request.");
      toast.success("Registration request submitted! Awaiting admin approval.");
      
      // Reset form
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        description: "",
        doctor_id: doctors[0]?._id || "",
      });
      setImageFile(null);
      
      // Update request status
      setRequestStatus({
        hasRequest: true,
        status: "pending",
        loading: false
      });
      
      if (onSubmitted) onSubmitted(apiRes.data);

      // Navigate back after success
      setTimeout(() => {
        navigate(-1);
      }, 3000);

    } catch (err) {
      console.error("Error submitting patient request:", err);
      const errorMessage = 
        (typeof err === "string" && err) ||
        err.response?.data?.message ||
        err.message ||
        "Error submitting patient registration request";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking request status
  if (requestStatus.loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show different content if user already has a request
  if (requestStatus.hasRequest) {
    return (
      <FadeInSection>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full max-w-lg mx-auto p-6 bg-white rounded shadow-md text-center">
            <h2 className="text-2xl font-semibold mb-4">Registration Status</h2>
            
            {requestStatus.status === "pending" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="animate-pulse w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-yellow-800 font-semibold">Request Pending</span>
                </div>
                <p className="text-yellow-700 mb-3">
                  Your patient registration request is being reviewed by our admin team.
                </p>
                <div className="text-sm text-yellow-600">
                  <p>• You'll receive an email notification once approved</p>
                  <p>• Processing usually takes 1-2 business days</p>
                </div>
              </div>
            )}

            {requestStatus.status === "approved" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-green-600 text-xl mr-2">✓</span>
                  <span className="text-green-800 font-semibold">Request Approved</span>
                </div>
                <p className="text-green-700 mb-3">
                  Congratulations! Your patient registration has been approved.
                </p>
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Book Appointment
                </button>
              </div>
            )}

            {requestStatus.status === "rejected" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-red-600 text-xl mr-2">✕</span>
                  <span className="text-red-800 font-semibold">Request Rejected</span>
                </div>
                <p className="text-red-700 mb-3">
                  Your patient registration request has been rejected.
                </p>
                <button
                  onClick={() => setRequestStatus({ hasRequest: false, status: null, loading: false })}
                  className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
                >
                  Submit New Request
                </button>
              </div>
            )}

            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition mt-4"
            >
              Go Back
            </button>
          </div>
        </div>
      </FadeInSection>
    );
  }

  return (
    <FadeInSection>
      <div
        className="min-h-screen flex flex-col lg:flex-row items-center justify-center mt-14"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Info Panel */}
        <div className="w-full lg:w-1/2 px-4 sm:px-8 lg:px-16 text-black flex flex-col justify-center items-center lg:items-start mb-8 lg:mb-0">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-center lg:text-left">
            Patient Registration <span className="text-cyan-500">Request</span>
          </h1>
          <p className="mb-6 text-base sm:text-lg max-w-lg text-gray-800 text-center lg:text-left">
            Submit your patient registration request to get started with Medicare Pro. 
            Our admin team will review your information and approve your access to our healthcare management system.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg">
            <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Admin reviews your registration request</li>
              <li>• You'll receive approval notification</li>
              <li>• Start booking appointments with your chosen doctor</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md sm:max-w-lg mx-auto p-4 sm:p-6 bg-white rounded shadow-md min-h-[380px] sm:min-h-[520px] flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Request Patient Access</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <strong>Success:</strong> {success}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium" htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium" htmlFor="doctor_id">Preferred Doctor *</label>
              <select
                id="doctor_id"
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium" htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <label className="block mb-2 font-medium" htmlFor="description">Medical History / Notes</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            placeholder="Please describe any relevant medical history, current conditions, or special requirements..."
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <label className="block mb-2 font-medium" htmlFor="image">Profile Image (Optional)</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="mb-6 text-sm"
          />
          {imageFile && (
            <p className="text-sm text-green-600 mb-4">
              ✓ Image selected: {imageFile.name}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || requestStatus.hasRequest}
            className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting Request..." : "Submit Registration Request"}
          </button>

          <p className="text-xs text-gray-600 mt-3 text-center">
            Your request will be reviewed by our admin team. You'll receive a notification once approved.
          </p>
        </form>
      </div>
    </FadeInSection>
  );
}
