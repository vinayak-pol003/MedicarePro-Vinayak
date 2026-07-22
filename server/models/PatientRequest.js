import mongoose from "mongoose";

const patientRequestSchema = new mongoose.Schema({
  // User who submitted the request
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  // Patient information from form
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  
  email: { 
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  
  phone: { 
    type: String,
    required: true,
    trim: true
  },
  
  description: { 
    type: String,
    maxlength: 500
  },
  
  image: { 
    type: String // URL or path to patient image
  },
  
  doctor_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Doctor",
    required: true
  },

  // Request status
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  // Admin who processed the request
  processed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // Reason for rejection (if rejected)
  rejection_reason: {
    type: String
  },

  // Generated patient_id after approval
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  }
}, { timestamps: true });

const PatientRequest = mongoose.model("PatientRequest", patientRequestSchema);
export default PatientRequest;
