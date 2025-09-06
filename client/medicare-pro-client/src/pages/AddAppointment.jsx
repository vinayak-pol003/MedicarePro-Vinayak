import { useState, useEffect, useContext } from "react";
import axios from "axios";
import bgImage from "../assets/bg.png";
import { AuthContext } from "../contex/AuthContext.jsx";

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
          setFormData((prev) => ({ ...prev, patient_id: patientsRes.data[0]._id }));
        }
        if (doctorsRes.data.length > 0 && !formData.doctor_id) {
          setFormData((prev) => ({ ...prev, doctor_id: doctorsRes.data[0]._id }));
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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left Info Panel */}
      <div className="flex flex-col justify-center w-1/2 px-16 text-black">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Medicare <span className="text-cyan-500">Pro</span>
        </h1>
        <p className="mb-6 text-lg max-w-lg text-gray-800">
          Seamlessly book and track appointments.<br />
          Your care experience starts here.
        </p>
      </div>
      {/* Right form panel, wider and taller */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-12 bg-white rounded shadow-md mt-8 w-[34rem] min-h-[520px] flex flex-col justify-center"
      >
        <h2 className="text-2xl font-semibold mb-6">Add Appointment</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <div className="flex gap-6 mb-4">
          <div className="flex-1 min-w-[170px]">
            <label className="block mb-2 font-medium" htmlFor="patient_id">
              Patient *
            </label>
            <select
              id="patient_id"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2"
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} {patient.email ? `(${patient.email})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[170px]">
            <label className="block mb-2 font-medium" htmlFor="doctor_id">
              Doctor *
            </label>
            <select
              id="doctor_id"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2"
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

        <div className="flex gap-6 mb-4">
          <div className="flex-1 min-w-[170px]">
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
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>
          <div className="flex-1 min-w-[170px]">
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
              className="w-full border border-gray-300 rounded px-4 py-2"
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
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
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
  );
}
