import express from "express";
import Prescription from "../models/Prescription.js";
import Appointment from "../models/Appointment.js";
import { authMiddleware, roleCheck } from "../middleware/auth.js";

const router = express.Router();

// Doctor writes prescription for an appointment
router.post("/:appointmentId", authMiddleware, roleCheck(["doctor", "admin"]), async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Find appointment with doctor/patient details
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctor_id")
      .populate("patient_id");

    if (!appointment) {
      console.error("Appointment not found for ID:", appointmentId);
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Defensive: Ensure the appointment has doctor/patient set
    if (!appointment.doctor_id || !appointment.patient_id) {
      console.error("Missing doctor/patient in appointment:", appointment);
      return res.status(400).json({ message: "Appointment is missing doctor or patient information" });
    }

    // Prevent duplicate prescriptions for same appointment
    const existingRx = await Prescription.findOne({ appointment: appointment._id });
    if (existingRx) {
      return res.status(409).json({ message: "Prescription already exists for this appointment" });
    }

    // Create new prescription
    const prescription = new Prescription({
      doctor: appointment.doctor_id._id,
      patient: appointment.patient_id._id,
      appointment: appointment._id,
      symptoms: req.body.symptoms,
      diagnosis: req.body.diagnosis,
      medications: req.body.medications,
      notes: req.body.notes,
    });

    await prescription.save();

    // Link prescription to appointment (solves frontend visibility issue)
    appointment.prescription = prescription._id;
    await appointment.save();

    res.status(201).json(prescription);

  } catch (err) {
    console.error("Prescription save error:", err);
    res.status(500).json({ message: "Error saving prescription", error: err.message });
  }
});

// Patient/doctor fetches prescription by appointmentId
router.get("/:appointmentId", authMiddleware, roleCheck(["patient", "doctor"]), async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const prescription = await Prescription.findOne({ appointment: appointmentId })
      .populate("doctor", "name specialization email")
      .populate("patient", "name email");

    if (!prescription) {
      console.warn("No prescription found for appointment:", appointmentId);
      return res.status(404).json({ message: "No prescription found for this appointment" });
    }

    res.status(200).json(prescription);

  } catch (err) {
    console.error("Prescription fetch error:", err);
    res.status(500).json({
      message: "Error fetching prescription",
      error: err.message
    });
  }
});

export default router;
