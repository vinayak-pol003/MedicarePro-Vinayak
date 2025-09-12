import { useState, useEffect, useContext } from "react";
import axios from "axios";
import bgImage from "../assets/bg.png";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade.jsx";
import imagekit from "../utils/imagekit.jsx"; // <-- Import your utility

export default function AddPatient({ onAdded }) {
  const { user } = useContext(AuthContext);

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

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(response.data);
        if (response.data.length > 0 && !formData.doctor_id) {
          setFormData(prev => ({ ...prev, doctor_id: response.data[0]._id }));
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors list");
      }
    };
    fetchDoctors();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // File input handler with image validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setImageFile(file);
      setError("");
    } else {
      setImageFile(null);
      setError("Please select a valid image (.jpg or .png)");
    }
  };

  // Upload image to ImageKit and send cloud URL to backend
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);

  if (!formData.name || !formData.doctor_id) {
    setError("Name and Doctor are required");
    setLoading(false);
    return;
  }

  let imageUrl = "";
  try {
    // Fetch authentication params from backend manually
    const res = await fetch("http://localhost:5000/api/imagekit-auth");
    const authParams = await res.json(); // { token, signature, expire }

    if (imageFile) {
      imageUrl = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: imageFile,
            fileName: imageFile.name,
            folder: "MedicareImages",
            token: authParams.token,
            signature: authParams.signature,
            expire: authParams.expire,
          },
          (err, result) => {
            if (err) {
              setError("Image upload failed");
              reject(err.message || "Image upload failed");
            } else resolve(result.url);
          }
        );
      });
    }

    const token = user?.token || localStorage.getItem("token") || "";

    const payload = {
      ...formData,
      image: imageUrl
    };

    const apiRes = await axios.post("http://localhost:5000/api/patients", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSuccess("Patient added successfully!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      description: "",
      doctor_id: "",
    });
    setImageFile(null);
    if (onAdded) onAdded(apiRes.data);
  } catch (err) {
    setError(
      (typeof err === "string" && err) ||
      err.response?.data?.message ||
      "Error adding patient"
    );
  } finally {
    setLoading(false);
  }
};


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
            Welcome to Medicare <span className="text-cyan-500">Pro</span>
          </h1>
          <p className="mb-6 text-base sm:text-lg max-w-lg text-gray-800 text-center lg:text-left">
            Your trusted partner in healthcare management. Seamlessly manage your patients, appointments, and medical records anytime, anywhere — all with the security and privacy you deserve.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md sm:max-w-lg mx-auto p-4 sm:p-6 bg-white rounded shadow-md min-h-[380px] sm:min-h-[520px] flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Add New Patient</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium" htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium" htmlFor="doctor_id">Doctor *</label>
              <select
                id="doctor_id"
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization} ({doctor.email})
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
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium" htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
              />
            </div>
          </div>

          <label className="block mb-2 font-medium" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm sm:text-base"
          ></textarea>

          <label className="block mb-2 font-medium" htmlFor="image">Patient Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition"
          >
            {loading ? "Saving..." : "Add Patient"}
          </button>
        </form>
      </div>
    </FadeInSection>
  );
}
