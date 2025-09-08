import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import bgImage from '../assets/bg.png'


const MyPrescription = () => {
  const { id } = useParams(); // appointmentId from route
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/prescriptions/${id}`); // Correct backend route!
        setPrescription(res.data);
      } catch (err) {
        setError("Failed to load prescription");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id]);

  const handleDownload = () => {
    if (!prescription) return;
    // Build text representation for download
    const content = `
Prescription Details

Doctor: ${prescription.doctor?.name || ""} (${prescription.doctor?.specialization || ""})
Patient: ${prescription.patient?.name || ""} (${prescription.patient?.email || ""})
Date: ${prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : ""}

Symptoms:
${prescription.symptoms || ""}

Diagnosis:
${prescription.diagnosis || ""}

Medications:
${prescription.medications && prescription.medications.length > 0
  ? prescription.medications.map(
      (med, idx) => `- ${med.name}: ${med.dosage} ${med.instructions ? `(${med.instructions})` : ""}`
    ).join("\n")
  : "None"
}

Notes:
${prescription.notes || ""}
`;

    // Create and download the file
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "prescription.txt";
    link.click();
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-cyan-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
        Loading prescription...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="p-10 text-center text-gray-600">
        No prescription found for this appointment.
      </div>
    );
  }

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
    <div className="p-6 mt-13 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-cyan-600 mb-6">
          My Prescription
        </h1>
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Patient:</p>
          <p className="text-gray-600">
            {prescription.patient?.name} ({prescription.patient?.email})
          </p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Doctor:</p>
          <p className="text-gray-600">
            {prescription.doctor?.name} ({prescription.doctor?.specialization})
          </p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Date:</p>
          <p className="text-gray-600">
            {new Date(prescription.createdAt).toLocaleDateString()}
          </p>
        </div>
        {prescription.symptoms && (
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Symptoms:</p>
            <p className="text-gray-600">{prescription.symptoms}</p>
          </div>
        )}
        {prescription.diagnosis && (
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Diagnosis:</p>
            <p className="text-gray-600">{prescription.diagnosis}</p>
          </div>
        )}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Medications:</p>
          {prescription.medications && prescription.medications.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {prescription.medications.map((med, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{med.name}</span> —{" "}
                  {med.dosage}{" "}
                  {med.instructions && (
                    <span className="italic">({med.instructions})</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No medications listed.</p>
          )}
        </div>
        {prescription.notes && (
          <div className="mb-6">
            <p className="text-gray-700 font-semibold">Notes:</p>
            <p className="text-gray-600">{prescription.notes}</p>
          </div>
        )}

        {/* Download & Back Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
          >
            Download Prescription
          </button>
          <Link
            to="/my-appointments"
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Back to Appointments
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MyPrescription;
