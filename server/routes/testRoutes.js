import express from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import { authMiddleware, roleCheck } from "../middleware/auth.js";

dotenv.config();
const router = express.Router();

// ------------------- MULTER CONFIG -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only JPEG and PNG images are allowed"));
  },
});

// ------------------- USERS -------------------
router.get("/users", authMiddleware, roleCheck(["admin","doctor"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/users/:id", authMiddleware, roleCheck(["admin"]), async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Prevent deletion of super admin (optional protection)
    if (user.email === "chand@gmail.com") {
      return res.status(403).json({ message: "Cannot delete super admin account" });
    }
    
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h"}
    );
    res.json({
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ------------------- PATIENTS -------------------
// Get all patients (admin & doctor only)
router.get("/patients", authMiddleware, roleCheck(["admin", "doctor"]), async (req, res) => {
  try {
    const patients = await Patient.find().populate("doctor_id", "name email specialization");
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create patient (doctor and admin allowed)
// router.post(
//   "/patients",
//   authMiddleware,
//   roleCheck(["doctor", "admin"]),
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const { name, email, phone, description, doctor_id } = req.body;
//       if (!name || !doctor_id)
//         return res.status(400).json({ message: "Name and doctor_id are required" });

//       if (!mongoose.Types.ObjectId.isValid(doctor_id))
//         return res.status(400).json({ message: "Invalid doctor ID format." });

//       const doctor = await Doctor.findById(doctor_id);
//       if (!doctor) return res.status(400).json({ message: "Selected doctor not found" });

//       const image = req.file ? `/uploads/${req.file.filename}` : undefined;
//       const newPatient = new Patient({ name, email, phone, description, doctor_id, image });

//       await newPatient.save();
//       res.status(201).json(newPatient);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

router.post(
  "/patients",
  authMiddleware,
  roleCheck(["doctor", "admin"]),
  async (req, res) => {
    try {
      const { name, email, phone, description, doctor_id, image } = req.body; 
      // image is a string (ImageKit CDN URL) sent from frontend

      if (!name || !doctor_id)
        return res.status(400).json({ message: "Name and doctor_id are required" });

      if (!mongoose.Types.ObjectId.isValid(doctor_id))
        return res.status(400).json({ message: "Invalid doctor ID format." });

      const doctor = await Doctor.findById(doctor_id);
      if (!doctor) return res.status(400).json({ message: "Selected doctor not found" });

      const newPatient = new Patient({ name, email, phone, description, doctor_id, image });
      await newPatient.save();

      res.status(201).json(newPatient);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


router.delete(
  "/patients/:id",
  authMiddleware,
  roleCheck(["admin", "doctor"]),
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid patient id." });
      }
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found." });
      }
      // (Optional) You could also delete or update related appointments here if desired.
      res.json({ message: "Patient deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Update patient by ID
router.put("/patients/:id", authMiddleware, roleCheck(["admin", "doctor"]), async (req, res) => {
  try {
    const patientId = req.params.id;
    const { name, email, phone, description } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    
    // Check if patient exists
    const existingPatient = await Patient.findById(patientId);
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    // Additional security check for doctors - they can only update their own patients
    if (req.user.role === "doctor" && existingPatient.doctor_id?.email !== req.user.email) {
      return res.status(403).json({ message: "You can only update your own patients" });
    }
    
    // Update patient
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        description: description?.trim() || null
      },
      { new: true, runValidators: true }
    ).populate('doctor_id', 'name email specialization');
    
    res.status(200).json({
      message: "Patient updated successfully",
      patient: updatedPatient
    });
    
  } catch (err) {
    console.error("Error updating patient:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// View single patient (optional, for 'view details' page)
router.get(
  "/patients/:id",
  authMiddleware,
  roleCheck(["admin", "doctor"]),
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid patient id." });
      }
      const patient = await Patient.findById(req.params.id).populate("doctor_id", "name email specialization");
      if (!patient) {
        return res.status(404).json({ message: "Patient not found." });
      }
      res.json(patient);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// ------------------- APPOINTMENTS -------------------
// Get all appointments (admin & doctor only)
// router.get(
//   "/appointments",
//   authMiddleware,
//   roleCheck(["admin", "doctor"]),
//   async (req, res) => {
//     try {
//       const appointments = await Appointment.find()
//         .populate("patient_id", "name email")
//         .populate("doctor_id", "name email specialization");
//       res.json(appointments);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );
// // Create appointment (always links to existing patient by _id)
// router.post("/appointments", authMiddleware, roleCheck(["patient", "doctor", "admin"]), async (req, res) => {
//   try {
//     const { patient_id, doctor_id, date, time, status } = req.body;
//     if (!patient_id || !doctor_id || !date || !time) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     // Ensure patient_id is an ObjectId
//     if (!mongoose.Types.ObjectId.isValid(patient_id)) {
//       return res.status(400).json({ message: "Invalid patient id." });
//     }
//     const newAppointment = new Appointment({ patient_id, doctor_id, date, time, status });
//     await newAppointment.save();
//     res.status(201).json(newAppointment);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// // Update appointment
// router.put("/appointments/:id", authMiddleware, roleCheck(["patient", "doctor", "admin"]), async (req, res) => {
//   try {
//     const updateFields = req.body;
//     const updated = await Appointment.findByIdAndUpdate(req.params.id, updateFields, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// // Delete appointment
// router.delete("/appointments/:id", authMiddleware, roleCheck(["patient", "doctor", "admin"]), async (req, res) => {
//   try {
//     await Appointment.findByIdAndDelete(req.params.id);
//     res.json({ message: "Appointment deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// // ------------------- PATIENT-SPECIFIC ROUTES -------------------
// // Get logged-in patient's appointments
// router.get(
//   "/appointments/my",
//   authMiddleware,
//   roleCheck(["patient"]),
//   async (req, res) => {
//     try {
//       // Find patient document with the user's email
//       const patient = await Patient.findOne({ email: req.user.email });
//       if (!patient) {
//         // No patient profile found with this email
//         return res.json([]);
//       }
//       // Find appointments for that patient
//       const appointments = await Appointment.find({ patient_id: patient._id })
//         .populate("doctor_id", "name email specialization");
//       res.json(appointments);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );



router.get(
  "/appointments",
  authMiddleware,
  roleCheck(["admin", "doctor"]),
  async (req, res) => {
    try {
      const appointments = await Appointment.find()
        .populate("patient_id", "name email")
        .populate("doctor_id", "name email specialization")
        .populate("prescription"); // <- ADDED: Always populate prescription!
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


  router.get(
    "/appointments/today",
    authMiddleware,
    roleCheck(["admin", "doctor"]),
    async (req, res) => {
      try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        const appointments = await Appointment.find({
          date: {
            $gte: startOfDay,
            $lt: endOfDay,
          }
        })
        .populate("patient_id", "name email")
        .populate("doctor_id", "name email specialization")
        .populate("prescription");

        res.json(appointments);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );






// Create appointment (always links to existing patient by _id)
router.post("/appointments", authMiddleware, roleCheck(["patient", "doctor", "admin"]), async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time, status } = req.body;
    if (!patient_id || !doctor_id || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Ensure patient_id is an ObjectId
    if (!mongoose.Types.ObjectId.isValid(patient_id)) {
      return res.status(400).json({ message: "Invalid patient id." });
    }
    // Ensure prescription is always present in model
    const newAppointment = new Appointment({ patient_id, doctor_id, date, time, status, prescription: null });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update appointment
router.put("/appointments/:id", authMiddleware, roleCheck(["patient", "doctor", "admin"]), async (req, res) => {
  try {
    const updateFields = req.body;
    const updated = await Appointment.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete appointment
router.delete("/appointments/:id", authMiddleware, roleCheck(["patient", "doctor", "admin"]), async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- PATIENT-SPECIFIC ROUTES -------------------

// Get logged-in patient's appointments
router.get(
  "/appointments/my",
  authMiddleware,
  roleCheck(["patient"]),
  async (req, res) => {
    try {
      // Find patient document with the user's email
      const patient = await Patient.findOne({ email: req.user.email });
      if (!patient) {
        // No patient profile found with this email
        return res.json([]);
      }
      // Find appointments for that patient, populate doctor AND prescription
      const appointments = await Appointment.find({ patient_id: patient._id })
        .populate("doctor_id", "name email specialization")
        .populate("prescription"); // <- ADDED: Always populate prescription!
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
