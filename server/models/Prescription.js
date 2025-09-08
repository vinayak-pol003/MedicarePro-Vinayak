// models/Prescription.js
import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
  symptoms: { type: String },
  diagnosis: { type: String },
  medications: [
    {
      name: { type: String },
      dosage: { type: String },
      instructions: { type: String }
    }
  ],
  notes: { type: String }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

export default mongoose.model("Prescription", PrescriptionSchema);
