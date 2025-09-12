import { useState, useContext } from "react";
import axios from "axios";
import bgImage from "../assets/bg.png";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade.jsx";
import imagekit from "../utils/imagekit.jsx";


export default function AddDoctor({ onAdded }) {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    qualification: "",
    bio: "",
    consultation_fee: "",
    is_active: true,
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);

  if (!formData.name || !formData.email || !formData.specialization || !formData.password) {
    setError("Name, email, specialization and password are required");
    setLoading(false);
    return;
  }

  let imageUrl = "";
  try {
    if (imageFile) {
      // Fetch auth params and upload to ImageKit cloud
      const res = await fetch("http://localhost:5000/api/imagekit-auth");
      const authParams = await res.json();

      imageUrl = await new Promise((resolve, reject) => {
        imagekit.upload({
          file: imageFile,
          fileName: imageFile.name,
          folder: "DoctorImages",
          token: authParams.token,
          signature: authParams.signature,
          expire: authParams.expire,
        }, (err, result) => {
          if (err) {
            setError("Image upload failed");
            reject(err.message || "Image upload failed");
          } else resolve(result.url);
        });
      });
    }

    const token = user?.token || localStorage.getItem("token") || "";

    // 1. Create doctor profile (send image URL, not file)
    const doctorPayload = {
      ...formData,
      image: imageUrl,
    };
    delete doctorPayload.password; // don't send password to doctor profile

    const doctorRes = await axios.post("http://localhost:5000/api/doctors", doctorPayload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2. Create user account for doctor login
    await axios.post("http://localhost:5000/api/users", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "doctor",
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSuccess("Doctor added and user account created!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      qualification: "",
      bio: "",
      consultation_fee: "",
      is_active: true,
      password: "",
    });
    setImageFile(null);
    if (onAdded) onAdded(doctorRes.data);
  } catch (err) {
    setError(err.response?.data?.message || "Error adding doctor or creating account");
  } finally {
    setLoading(false);
  }
};


  return (
    <FadeInSection>
      <div
        className="min-h-screen flex flex-col lg:flex-row items-center justify-center "
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full lg:w-1/2 px-4 sm:px-8 lg:px-16 text-black flex flex-col justify-center items-center lg:items-start mb-8 lg:mb-0">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-center lg:text-left">
            Add <span className="text-cyan-500">Doctor</span>
          </h1>
          <p className="mb-6 text-base sm:text-lg max-w-lg text-gray-800 text-center lg:text-left">
            Expand your team with specialized, experienced doctors. Upload credentials and bio for patient transparency.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md sm:max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded shadow-md min-h-[380px] sm:min-h-[580px] flex flex-col justify-center mt-18"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Add New Doctor</h2>
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
              <label className="block mb-2 font-medium" htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
            <div className="flex-1">
              <label className="block mb-2 font-medium" htmlFor="specialization">Specialization *</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
                placeholder="E.g. Cardiology"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium" htmlFor="experience">Experience (yrs)</label>
              <input
                type="number"
                min="0"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium" htmlFor="consultation_fee">Consultation Fee</label>
              <input
                type="number"
                min="0"
                id="consultation_fee"
                name="consultation_fee"
                value={formData.consultation_fee}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
              />
            </div>
          </div>

          <label className="block mb-2 font-medium" htmlFor="qualification">Qualification</label>
          <input
            type="text"
            id="qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm sm:text-base"
            placeholder="E.g. MBBS, MD"
          />

          <label className="block mb-2 font-medium" htmlFor="bio">Biography</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm sm:text-base"
            placeholder="Short introduction, expertise and interests"
          ></textarea>

          <label className="block mb-2 font-medium" htmlFor="image">Doctor's Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="mb-6"
          />

          <label className="block mb-2 font-medium" htmlFor="password">Set Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm sm:text-base"
          />

          <div className="flex items-center mb-6">
            <label className="mr-2 font-medium" htmlFor="is_active">Active</label>
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition"
          >
            {loading ? "Saving..." : "Add Doctor"}
          </button>
        </form>
      </div>
    </FadeInSection>
  );
}
