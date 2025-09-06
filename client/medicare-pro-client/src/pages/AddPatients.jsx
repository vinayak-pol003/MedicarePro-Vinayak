import { useState, useEffect, useContext } from "react";
import axios from "axios";
import bgImage from "../assets/bg.png";
import { AuthContext } from "../contex/AuthContext.jsx";

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
        // Set default doctor if available
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

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

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

    try {
      // Always get token from context (fresh after login), fallback to localStorage
      const token = user?.token || localStorage.getItem("token") || "";

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("description", formData.description);
      data.append("doctor_id", formData.doctor_id);
      if (imageFile) data.append("image", imageFile);

      const res = await axios.post("http://localhost:5000/api/patients", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
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
      if (onAdded) onAdded(res.data); // callback to parent if needed
    } catch (err) {
      setError(err.response?.data?.message || "Error adding patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col justify-center w-1/2 px-16 text-black">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Medicare <span className="text-cyan-500">Pro</span>
        </h1>
        <p className="mb-6 text-lg max-w-lg text-gray-800">
          Your trusted partner in healthcare management. Seamlessly manage your patients, appointments, and medical records anytime, anywhere — all with the security and privacy you deserve.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow-md mt-16 w-full">
        <h2 className="text-2xl font-semibold mb-6">Add New Patient</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium" htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
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
              className="w-full border border-gray-300 rounded px-3 py-2"
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

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
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
              className="w-full border border-gray-300 rounded px-3 py-2"
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
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
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
  );
}
