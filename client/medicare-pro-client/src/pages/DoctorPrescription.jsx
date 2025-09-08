import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from '../assets/bg.png'

export default function DoctorPrescription() {
  const { id } = useParams(); // appointment id from route
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    symptoms: "",
    diagnosis: "",
    medications: [{ name: "", dosage: "", instructions: "" }],
    notes: "",
  });

  const handleChange = (e, index, field) => {
    if (field) {
      // medication field change
      const updated = [...formData.medications];
      updated[index][field] = e.target.value;
      setFormData({ ...formData, medications: updated });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { name: "", dosage: "", instructions: "" },
      ],
    });
  };

  const removeMedication = (index) => {
    const updated = [...formData.medications];
    updated.splice(index, 1);
    setFormData({ ...formData, medications: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/prescriptions/${id}`, // USE id, not patientId
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Prescription saved successfully!");
      setTimeout(() => navigate(-1), 1500); // go back after save
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save prescription"
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
        {/* left panel */}
            <div className="flex flex-col justify-center w-1/2 px-16 text-black">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Medicare <span className="text-cyan-500">Pro</span>
        </h1>
        <p className="mb-6 text-lg max-w-lg text-gray-800">
          Your trusted partner in healthcare management. Seamlessly manage your patients, appointments, and medical records anytime, anywhere — all with the security and privacy you deserve.
        </p>
      </div>

    {/* right */}
    <div className="max-w-2xl mx-auto p-8 bg-white shadow mt-16 rounded-lg max-h-[650px]">
      <h2 className="text-2xl font-bold mb-6 text-cyan-800">Add Doctor's Prescription</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="font-semibold block mb-2">Symptoms</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            className="border p-1 w-full rounded"
            disabled={loading}
            required
          />
        </div>
        <div className="mb-4">
          <label className="font-semibold block mb-2">Diagnosis</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            className="border p-1 w-full rounded"
            disabled={loading}
            required
          />
        </div>
        <div className="mb-4">
          <label className="font-semibold block mb-2">Medications</label>
          {formData.medications.map((med, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={med.name}
                onChange={e => handleChange(e, i, "name")}
                className="border rounded p-1 w-1/4"
                disabled={loading}
                required
              />
              <input
                type="text"
                placeholder="Dosage"
                value={med.dosage}
                onChange={e => handleChange(e, i, "dosage")}
                className="border rounded p-1 w-1/4"
                disabled={loading}
                required
              />
              <input
                type="text"
                placeholder="Instructions"
                value={med.instructions}
                onChange={e => handleChange(e, i, "instructions")}
                className="border rounded p-1 w-1/2"
                disabled={loading}
                required
              />
              {formData.medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedication(i)}
                  className="text-red-500 hover:text-red-700 font-bold px-2"
                  disabled={loading}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMedication}
            className="bg-cyan-500 text-white px-3 py-1 rounded mt-2"
            disabled={loading}
          >
            + Add Medication
          </button>
        </div>
        <div className="mb-4">
          <label className="font-semibold block mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            disabled={loading}
          />
        </div>
        {error && (
          <div className="text-red-600 mb-2">{error}</div>
        )}
        {success && (
          <div className="text-green-700 mb-2">{success}</div>
        )}
        <button
          type="submit"
          className="bg-cyan-600 text-white px-6 py-2 rounded font-bold hover:bg-cyan-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Prescription"}
        </button>
      </form>
    </div>

     </div>
  );
}
