import { useState, useEffect, useContext } from "react";
import axios from "axios";
import bgImage from "../assets/bg.png";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade";

export default function AddAppointment({ onAdded }) {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    date: "",
    time: "",
    status: "scheduled"
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = user?.token || localStorage.getItem("token") || "";
        const [patientsRes, doctorsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/doctors"),
        ]);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);

        if (patientsRes.data.length > 0 && !formData.patient_id) {
          setFormData((prev) => ({ ...prev, patient_id: patientsRes.data._id }));
        }
        if (doctorsRes.data.length > 0 && !formData.doctor_id) {
          setFormData((prev) => ({ ...prev, doctor_id: doctorsRes.data._id }));
        }
      } catch {
        setError("Failed to load patients or doctors list");
      }
    };
    fetchLists();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.patient_id || !formData.doctor_id || !formData.date || !formData.time) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const token = user?.token || localStorage.getItem("token") || "";
      await axios.post("http://localhost:5000/api/appointments", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Appointment added successfully!");
      setFormData({
        patient_id: "",
        doctor_id: "",
        date: "",
        time: "",
        status: "scheduled"
      });
      if (onAdded) onAdded();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error adding appointment"
      );
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
        {/* Left Info Panel */}
        <div className="w-full lg:w-1/2 px-4 sm:px-8 lg:px-16 text-black flex flex-col justify-center items-center lg:items-start mb-8 lg:mb-0 mt-18">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-center lg:text-left">
            Welcome to Medicare <span className="text-cyan-500">Pro</span>
          </h1>
          <p className="mb-6 text-base sm:text-lg max-w-lg text-gray-800 text-center lg:text-left">
            Seamlessly book and track appointments.<br />
            Your care experience starts here.
          </p>
        </div>
        {/* Right form panel */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md sm:max-w-xl mx-auto p-4 sm:p-8 bg-white rounded shadow-md mt-0 min-h-[400px] sm:min-h-[520px] flex flex-col justify-center"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Add Appointment</h2>

          {error && <p className="text-red-600 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
            <div className="flex-1 min-w-[140px]">
              <label className="block mb-2 font-medium" htmlFor="patient_id">
                Patient *
              </label>
              <select
                id="patient_id"
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-2 sm:px-4 py-2 text-sm sm:text-base"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} {patient.email ? `(${patient.email})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block mb-2 font-medium" htmlFor="doctor_id">
                Doctor *
              </label>
              <select
                id="doctor_id"
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-2 sm:px-4 py-2 text-sm sm:text-base"
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

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
            <div className="flex-1 min-w-[140px]">
              <label className="block mb-2 font-medium" htmlFor="date">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-2 sm:px-4 py-2 text-sm sm:text-base"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block mb-2 font-medium" htmlFor="time">
                Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-2 sm:px-4 py-2 text-sm sm:text-base"
              />
            </div>
          </div>

          <label className="block mb-2 font-medium" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 sm:px-4 py-2 mb-4 text-sm sm:text-base"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition"
          >
            {loading ? "Saving..." : "Add Appointment"}
          </button>
        </form>
      </div>
    </FadeInSection>
  );
}
