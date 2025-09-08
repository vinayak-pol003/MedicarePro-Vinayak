import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  // ---- Add this for prescription linkage ----
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription", default: null }
  // -------------------------------------------
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
