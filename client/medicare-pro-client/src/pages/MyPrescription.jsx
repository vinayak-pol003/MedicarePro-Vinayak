import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import bgImage from '../assets/bg.png'
import FadeInSection from "../utils/Fade";

const MyPrescription = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/prescriptions/${id}`);
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

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "prescription.txt";
    link.click();
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-cyan-600">
        <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
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
    <FadeInSection>
      <div
        className="min-h-screen flex flex-col lg:flex-row items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full lg:w-1/2 px-4 sm:px-8 lg:px-16 text-black flex flex-col justify-center items-center lg:items-start mb-8 mt-18 lg:mb-0">
          <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-cyan-600 text-center lg:text-left">
            Thank You for Choosing <span className="text-gray-800">Medicare Pro</span>
          </h1>
          <p className="mb-6 text-base sm:text-lg max-w-lg text-gray-700 text-center lg:text-left">
            We appreciate your trust in our healthcare services.  
            Our doctors and staff are dedicated to providing you with the best care possible.  
            You can manage your appointments, prescriptions, and medical records anytime — right here.
          </p>
        </div>
        <div className="p-4 sm:p-6 mt-0 sm:mt-13 w-full max-w-lg sm:max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
            <h1 className="text-lg sm:text-2xl font-bold text-cyan-600 mb-4 sm:mb-6">
              My Prescription
            </h1>
            <div className="mb-2 sm:mb-4">
              <p className="text-gray-700 font-semibold">Patient:</p>
              <p className="text-gray-600">
                {prescription.patient?.name} ({prescription.patient?.email})
              </p>
            </div>
            <div className="mb-2 sm:mb-4">
              <p className="text-gray-700 font-semibold">Doctor:</p>
              <p className="text-gray-600">
                {prescription.doctor?.name} ({prescription.doctor?.specialization})
              </p>
            </div>
            <div className="mb-2 sm:mb-4">
              <p className="text-gray-700 font-semibold">Date:</p>
              <p className="text-gray-600">
                {new Date(prescription.createdAt).toLocaleDateString()}
              </p>
            </div>
            {prescription.symptoms && (
              <div className="mb-2 sm:mb-4">
                <p className="text-gray-700 font-semibold">Symptoms:</p>
                <p className="text-gray-600">{prescription.symptoms}</p>
              </div>
            )}
            {prescription.diagnosis && (
              <div className="mb-2 sm:mb-4">
                <p className="text-gray-700 font-semibold">Diagnosis:</p>
                <p className="text-gray-600">{prescription.diagnosis}</p>
              </div>
            )}
            <div className="mb-2 sm:mb-4">
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
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-700 font-semibold">Notes:</p>
                <p className="text-gray-600">{prescription.notes}</p>
              </div>
            )}
            {/* Download & Back Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              <button
                onClick={handleDownload}
                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 mb-2 sm:mb-0"
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
    </FadeInSection>
  );
};

export default MyPrescription;
