import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  description: { type: String },
  image: { type: String }, // URL or path to patient image
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
