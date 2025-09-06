import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String,
    trim: true
  },
  specialization: { 
    type: String, 
    required: true,
    trim: true
  },
  experience: { 
    type: Number, 
    min: 0,
    default: 0
  },
  qualification: { 
    type: String,
    trim: true
  },
  bio: { 
    type: String,
    trim: true
  },
  image: { 
    type: String // URL or path to doctor image
  },
  consultation_fee: { 
    type: Number, 
    min: 0,
    default: 0
  },
  availability: {
    monday: { start: String, end: String, available: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
    thursday: { start: String, end: String, available: { type: Boolean, default: true } },
    friday: { start: String, end: String, available: { type: Boolean, default: true } },
    saturday: { start: String, end: String, available: { type: Boolean, default: false } },
    sunday: { start: String, end: String, available: { type: Boolean, default: false } }
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
}, { 
  timestamps: true 
});

// Index for better query performance
doctorSchema.index({ email: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ is_active: 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
