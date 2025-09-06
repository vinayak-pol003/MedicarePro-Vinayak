import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
