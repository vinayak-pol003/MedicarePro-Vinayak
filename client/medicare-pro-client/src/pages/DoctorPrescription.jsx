import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from '../assets/bg.png'
import FadeInSection from "../utils/Fade";

export default function DoctorPrescription() {
  const { id } = useParams();
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
        `http://localhost:5000/api/prescriptions/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Prescription saved successfully!");
      setTimeout(() => navigate(-1), 1500);
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
    <FadeInSection>
      <div
        className="min-h-screen flex flex-col lg:flex-row items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* left panel */}
        <div className="w-full lg:w-1/2 mt-16 px-4 sm:px-8 lg:px-16 text-black flex flex-col justify-center items-center lg:items-start mb-8 lg:mb-0">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-center lg:text-left">
            Doctor Prescription <span className="text-cyan-500">Medicare Pro</span>
          </h1>
          <p className="mb-6 text-base sm:text-lg max-w-2xl mx-auto text-gray-800 text-center lg:text-left">
            Empowering doctors to provide better care. Easily create, manage, and share 
            prescriptions with patients. Ensure accuracy, privacy, and accessibility for 
            every treatment plan.
          </p>
        </div>

        {/* right */}
        <div className="w-full max-w-md sm:max-w-xl mx-auto p-4 sm:p-8 bg-white shadow mt-0 sm:mt-16 rounded-lg max-h-none sm:max-h-[700px]">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-cyan-800">Add Doctor's Prescription</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="font-semibold block mb-2">Symptoms</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                className="border p-1 sm:p-2 w-full rounded text-sm sm:text-base"
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
                className="border p-1 sm:p-2 w-full rounded text-sm sm:text-base"
                disabled={loading}
                required
              />
            </div>
            <div className="mb-4">
  <label className="font-semibold block mb-2">Medications</label>
  <div className="flex flex-col gap-2 mb-2">
    {formData.medications.map((med, i) => (
      <div key={i} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Name"
          value={med.name}
          onChange={e => handleChange(e, i, "name")}
          className="border rounded p-1 w-full sm:w-1/4 text-sm sm:text-base"
          disabled={loading}
          required
        />
        <input
          type="text"
          placeholder="Dosage"
          value={med.dosage}
          onChange={e => handleChange(e, i, "dosage")}
          className="border rounded p-1 w-full sm:w-1/4 text-sm sm:text-base"
          disabled={loading}
          required
        />
        <input
          type="text"
          placeholder="Instructions"
          value={med.instructions}
          onChange={e => handleChange(e, i, "instructions")}
          className="border rounded p-1 w-full sm:w-1/2 text-sm sm:text-base"
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
      className="bg-cyan-500 text-white px-3 py-1 rounded mt-2 text-sm sm:text-base self-start"
      disabled={loading}
    >
      + Add Medication
    </button>
  </div>
</div>

            <div className="mb-4">
              <label className="font-semibold block mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="border p-1 sm:p-2 w-full rounded text-sm sm:text-base"
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
              className="bg-cyan-600 text-white px-4 sm:px-6 py-2 rounded font-bold hover:bg-cyan-700 w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Prescription"}
            </button>
          </form>
        </div>
      </div>
    </FadeInSection>
  );
}
