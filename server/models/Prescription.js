// models/Prescription.js
import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
  symptoms: String,
  diagnosis: String,
  medications: [
    { name: String, dosage: String, instructions: String }
  ],
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Prescription", PrescriptionSchema);
