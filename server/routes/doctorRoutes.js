import express from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// ---------------- Multer Config ----------------
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only JPEG and PNG images are allowed"));
  },
});

// ---------------- Doctor Endpoints ----------------

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const { specialization, is_active } = req.query;

    let filter = {};
    if (specialization) filter.specialization = new RegExp(specialization, "i");
    if (is_active !== undefined) filter.is_active = is_active === "true";

    const doctors = await Doctor.find(filter).select("-__v");
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/appointment-counts", async (req, res) => {
  try {
    // Fetch all doctors
    const doctors = await Doctor.find({}, "_id name");
    // For each doctor: count their appointments
    const stats = await Promise.all(
      doctors.map(async (doc) => {
        const count = await Appointment.countDocuments({ doctor_id: doc._id });
        return { name: doc.name, appointmentsCount: count };
      })
    );
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointment counts." });
  }
});

// Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }

    const doctor = await Doctor.findById(req.params.id).select("-__v");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);
  } catch (err) {
    console.error("Error fetching doctor:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create doctor
// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       specialization,
//       experience,
//       qualification,
//       bio,
//       consultation_fee,
//     } = req.body;

//     if (!name || !email || !specialization) {
//       return res.status(400).json({
//         message: "Name, email, and specialization are required",
//       });
//     }

//     // Check if email already exists
//     const existingEmail = await Doctor.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const image = req.file ? `/uploads/${req.file.filename}` : undefined;

//     const newDoctor = new Doctor({
//       name,
//       email,
//       phone,
//       specialization,
//       experience: experience || 0,
//       qualification,
//       bio,
//       consultation_fee: consultation_fee || 0,
//       image,
//     });

//     await newDoctor.save();
//     res.status(201).json(newDoctor);
//   } catch (err) {
//     console.error("Error creating doctor:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      experience,
      qualification,
      bio,
      consultation_fee,
      image // ImageKit CDN URL from frontend
    } = req.body;

    if (!name || !email || !specialization) {
      return res.status(400).json({
        message: "Name, email, and specialization are required",
      });
    }

    // Check if email already exists
    const existingEmail = await Doctor.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Save the image as the CDN url (or undefined)
    const newDoctor = new Doctor({
      name,
      email,
      phone,
      specialization,
      experience: experience || 0,
      qualification,
      bio,
      consultation_fee: consultation_fee || 0,
      image: image || undefined, // ImageKit CDN URL as string
    });

    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    console.error("Error creating doctor:", err);
    res.status(500).json({ error: err.message });
  }
});


// Update doctor
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(updatedDoctor);
  } catch (err) {
    console.error("Error updating doctor:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete doctor
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }

    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
