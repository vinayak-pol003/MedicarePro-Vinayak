import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["scheduled", "completed", "cancelled", "deleted"], default: "scheduled" },
  // ---- Add this for prescription linkage ----
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription", default: null },
  // -------------------------------------------
  // ---- Add this for appointment rating ----
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    default: null // Allow null for unrated appointments
  }
  // -----------------------------------------
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
