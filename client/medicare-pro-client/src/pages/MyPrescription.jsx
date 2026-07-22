import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import bgImage from '../assets/bg.png'
import FadeInSection from "../utils/Fade";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

const MyPrescription = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prescription, setPrescription] = useState(null);

  const formatDoctorName = (name) => {
  if (!name) return "Doctor Name";
  return name.startsWith("Dr.") ? name : `Dr. ${name}`;
};

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

const handleDownloadPDF = () => {
  if (!prescription) return;
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  // Header Background (Cyan color)
  doc.setFillColor(6, 182, 212); // Cyan background
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Hospital Name (Left side - White text)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255); // White text
  doc.text("MEDICARE PRO", margin, 18);
  
  // Tagline (Left side)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Your Health, Our Priority", margin, 27);
  
  // Doctor Info (Right side - White text)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(formatDoctorName(prescription.doctor?.name), pageWidth - margin, 18, { align: 'right' });

  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(prescription.doctor?.specialization || "Specialization", pageWidth - margin, 27, { align: 'right' });
  
  // Patient Info Line (Just below header)
  let y = 45;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Name:", margin, y);
  
  doc.setFont("helvetica", "normal");
  doc.text(prescription.patient?.name || "________________", margin + 25, y);
  
  // Date on the right
  doc.setFont("helvetica", "bold");
  doc.text("Date:", pageWidth - margin - 60, y);
  
  doc.setFont("helvetica", "normal");
  const currentDate = prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US');
  doc.text(currentDate, pageWidth - margin - 35, y);
  
  // Add thin underline for the patient info section - FULL WIDTH
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3); // Thin line
  doc.line(margin, y + 2, pageWidth - margin, y + 2);
  
  y += 18;
  
  // Chief Complaints Section
  if (prescription.symptoms) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("CHIEF COMPLAINTS", margin, y);
    
    // Add thin cyan underline - FULL WIDTH
    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 1, pageWidth - margin, y + 1); // Full width line
    
    y += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const symptomsLines = doc.splitTextToSize(prescription.symptoms, pageWidth - 2 * margin);
    doc.text(symptomsLines, margin + 5, y);
    y += symptomsLines.length * 5 + 8;
  }
  
  // Diagnosis Section
  if (prescription.diagnosis) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("DIAGNOSIS", margin, y);
    
    // Add thin cyan underline - FULL WIDTH
    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 1, pageWidth - margin, y + 1); // Full width line
    
    y += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const diagnosisLines = doc.splitTextToSize(prescription.diagnosis, pageWidth - 2 * margin);
    doc.text(diagnosisLines, margin + 5, y);
    y += diagnosisLines.length * 5 + 8;
  }
  
  // Prescribed Medications Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PRESCRIBED MEDICATIONS", margin, y);
  
  // Add thin cyan underline - FULL WIDTH
  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 1, pageWidth - margin, y + 1); // Full width line
  
  y += 10;
  
 if (prescription.medications && prescription.medications.length > 0) {
  prescription.medications.forEach((med, idx) => {
    // Medication Number and Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${idx + 1}. ${med.name}`, margin + 5, y);
    y += 7;

    // Dosage
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const dosageLabel = "Dosage: ";
    doc.text(dosageLabel, margin + 25, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${med.dosage}`, margin + 25 + doc.getTextWidth(dosageLabel), y);
    y += 6;

    // Instructions
    if (med.instructions) {
      doc.setFont("helvetica", "bold");
      const instrLabel = "Instructions: ";
      doc.text(instrLabel, margin + 25, y);

      doc.setFont("helvetica", "normal");
      const instructionX = margin + 25 + doc.getTextWidth(instrLabel);
      const instructionLines = doc.splitTextToSize(
        med.instructions,
        pageWidth - instructionX - margin
      );
      doc.text(instructionLines, instructionX, y);
      y += instructionLines.length * 5;
    }

    y += 6;
  });
}
 else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("No medications prescribed", margin + 5, y);
    y += 10;
  }
  
  y += 5;
  
  // Additional Notes Section
  if (prescription.notes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("ADDITIONAL NOTES", margin, y);
    
    // Add thin cyan underline - FULL WIDTH
    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 1, pageWidth - margin, y + 1); // Full width line
    
    y += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const notesLines = doc.splitTextToSize(prescription.notes, pageWidth - 2 * margin);
    doc.text(notesLines, margin + 5, y);
    y += notesLines.length * 5 + 10;
  }
  
  // Calculate signature position to use remaining space
  const remainingSpace = pageHeight - 35 - y;
  const signatureY = y + Math.max(15, remainingSpace - 25);
  
  // Default Doctor's Signature (handwritten style)
  doc.setFont("helvetica", "italic");
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 150);
  
  const doctorName = prescription.doctor?.name || "Doctor Name";
  const signatureText = `${doctorName}`;
  
  // Add signature above the line
  doc.text(signatureText, pageWidth - margin - 70, signatureY - 5, { align: 'center' });
  
  // Signature line (right side) - thin line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(pageWidth - margin - 100, signatureY, pageWidth - margin, signatureY);
  
  // Doctor name and specialization under signature (right aligned)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`${prescription.doctor?.name || "Doctor Name"}`, pageWidth - margin - 50, signatureY + 8, { align: 'center' });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(prescription.doctor?.specialization || "Specialization", pageWidth - margin - 50, signatureY + 16, { align: 'center' });
  
  // Footer Address (Bottom of page)
  const footerY = pageHeight - 15;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Medicare Pro Clinic | Health Street, Medical City", pageWidth / 2, footerY - 6, { align: 'center' });
  doc.text("Phone: +91-1234567890 | Email: info@medicarepro.com | www.medicarepro.com", pageWidth / 2, footerY, { align: 'center' });
  
  // Save the PDF
  const fileName = `Medicare_Pro_Prescription_${prescription.patient?.name?.replace(/\s+/g, '_') || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  toast.success("Prescription downloaded successfully!");
};







  // Enhanced print function for direct printing
  const handlePrint = () => {
    if (!prescription) return;
    
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 20px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">MEDICARE PRO</h1>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Your Health, Our Priority</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 14px; font-weight: bold;">Dr. ${prescription.doctor?.name || ""}</p>
              <p style="margin: 0; font-size: 12px;">${prescription.doctor?.specialization || ""}</p>
            </div>
          </div>
        </div>

        <!-- Patient Info -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
          <span><strong>Name:</strong> ${prescription.patient?.name || ""}</span>
          <span><strong>Date:</strong> ${new Date(prescription.createdAt).toLocaleDateString()}</span>
        </div>

        <!-- Rx Symbol -->
        <div style="font-size: 48px; color: #06b6d4; font-weight: bold; margin: 20px 0;">℞</div>

        ${prescription.symptoms ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; border-bottom: 2px solid #06b6d4; padding-bottom: 5px;">CHIEF COMPLAINTS</h3>
          <p style="margin-left: 20px;">${prescription.symptoms}</p>
        </div>
        ` : ''}

        ${prescription.diagnosis ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; border-bottom: 2px solid #06b6d4; padding-bottom: 5px;">DIAGNOSIS</h3>
          <p style="margin-left: 20px;">${prescription.diagnosis}</p>
        </div>
        ` : ''}

        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; border-bottom: 2px solid #06b6d4; padding-bottom: 5px;">PRESCRIBED MEDICATIONS</h3>
          ${prescription.medications && prescription.medications.length > 0 
            ? prescription.medications.map((med, idx) => `
              <div style="margin: 15px 0; margin-left: 20px;">
                <p style="font-weight: bold; font-size: 16px;">${idx + 1}. ${med.name}</p>
                <p style="margin-left: 15px;"><strong>Dosage:</strong> ${med.dosage}</p>
                ${med.instructions ? `<p style="margin-left: 15px;"><strong>Instructions:</strong> ${med.instructions}</p>` : ''}
              </div>
            `).join('')
            : '<p style="margin-left: 20px; font-style: italic;">No medications prescribed</p>'
          }
        </div>

        ${prescription.notes ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; border-bottom: 2px solid #06b6d4; padding-bottom: 5px;">ADDITIONAL NOTES</h3>
          <p style="margin-left: 20px;">${prescription.notes}</p>
        </div>
        ` : ''}

        <!-- Signature -->
        <div style="margin-top: 40px; text-align: right;">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-left: auto; margin-bottom: 5px;"></div>
          <p style="margin: 0;"><strong>${prescription.doctor?.name || ""}</strong></p>
          <p style="margin: 0; font-size: 12px;">${prescription.doctor?.specialization || ""}</p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 15px; font-size: 10px; color: #666; text-align: center;">
          <p>Medicare Pro Clinic | Health Street, Medical City</p>
          <p>Phone: +91-1234567890 | Email: info@medicarepro.com | www.medicarepro.com</p>
          <p style="font-style: italic;">This is a computer-generated prescription</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Medicare Pro - Prescription</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { size: A4; margin: 0.5in; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    toast.success("Prescription sent to printer!");
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-cyan-600 mt-17">
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
        <div className="w-full lg:w-1/2 px-4 sm:px-8 lg:px-16 text-black flex flex-col justify-center items-center lg:items-start mb-8  lg:mb-0">
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
            {/* Header with gradient background similar to hospital letterhead */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-6 rounded-t-xl -m-4 sm:-m-8 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">MEDICARE PRO</h1>
                  <p className="text-sm opacity-90">Your Health, Our Priority</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold">{prescription.doctor?.name}</p>
                  <p className="text-xs opacity-90">{prescription.doctor?.specialization}</p>
                </div>
              </div>
            </div>

            {/* Patient info header */}
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200 mt-15">
              <span className="text-sm"><strong>Name:</strong> {prescription.patient?.name}</span>
              <span className="text-sm"><strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Prescription symbol */}
            <div className="text-4xl text-cyan-500 font-bold mb-4">℞</div>

            {/* Prescription content */}
            {prescription.symptoms && (
              <div className="mb-4">
                <h3 className="text-gray-700 font-semibold mb-2 border-b-2 border-cyan-500 pb-1">Chief Complaints</h3>
                <p className="text-gray-600 ml-4">{prescription.symptoms}</p>
              </div>
            )}
            
            {prescription.diagnosis && (
              <div className="mb-4">
                <h3 className="text-gray-700 font-semibold mb-2 border-b-2 border-cyan-500 pb-1">Diagnosis</h3>
                <p className="text-gray-600 ml-4">{prescription.diagnosis}</p>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-gray-700 font-semibold mb-2 border-b-2 border-cyan-500 pb-1">Prescribed Medications</h3>
              {prescription.medications && prescription.medications.length > 0 ? (
                <div className="ml-4">
                  {prescription.medications.map((med, idx) => (
                    <div key={idx} className="mb-3 p-3 bg-gray-50 rounded">
                      <p className="font-semibold text-gray-800">{idx + 1}. {med.name}</p>
                      <p className="text-sm text-gray-600"><strong>Dosage:</strong> {med.dosage}</p>
                      {med.instructions && (
                        <p className="text-sm text-gray-600"><strong>Instructions:</strong> {med.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 ml-4 italic">No medications prescribed at this time.</p>
              )}
            </div>

            {prescription.notes && (
              <div className="mb-6">
                <h3 className="text-gray-700 font-semibold mb-2 border-b-2 border-cyan-500 pb-1">Additional Notes</h3>
                <p className="text-gray-600 ml-4">{prescription.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
           <div className="flex flex-col sm:flex-row gap-3 sm:gap-7 justify-center mt-8">
  <button
    onClick={handleDownloadPDF}
    className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm"
  >
    Download PDF
  </button>
  <button
    onClick={handlePrint}
    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
  >
    Print Prescription
  </button>
  <Link
    to="/my-appointments"
    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-center font-medium text-sm"
  >
    ← Back to Appointments
  </Link>
</div>

            {/* Footer disclaimer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
              <p>This is a computer-generated prescription from Medicare Pro</p>
              <p>For any queries, please contact: info@medicarepro.com | +91-1234567890</p>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default MyPrescription;
