import PatientRequest from "../models/PatientRequest.js";

// Add these routes AFTER your existing routes:

// ------------------- PATIENT REQUESTS -------------------

// Get user's request status
router.get("/patient-requests/my-status", authMiddleware, roleCheck(["patient"]), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const request = await PatientRequest.findOne({ user_id: userId });
    
    res.json({
      hasRequest: !!request,
      status: request?.status || null,
      request: request || null
    });
  } catch (error) {
    console.error("Error checking request status:", error);
    res.status(500).json({ error: error.message });
  }
});

// Submit patient registration request
router.post("/patient-requests", authMiddleware, roleCheck(["patient"]), async (req, res) => {
  try {
    const { name, email, phone, description, image, doctor_id } = req.body;
    const user_id = req.user.id;

    // Check if user already has pending request
    const existingRequest = await PatientRequest.findOne({
      user_id,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: "You already have a pending patient registration request" 
      });
    }

    // Validate required fields
    if (!name || !doctor_id || !phone) {
      return res.status(400).json({
        message: "Name, phone, and doctor selection are required"
      });
    }

    // Validate doctor exists
    if (!mongoose.Types.ObjectId.isValid(doctor_id)) {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }

    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(400).json({ message: "Selected doctor not found" });
    }

    const patientRequest = new PatientRequest({
      user_id,
      name,
      email: email || req.user.email,
      phone,
      description,
      image,
      doctor_id
    });

    await patientRequest.save();

    res.status(201).json({
      message: "Patient registration request submitted successfully. Awaiting admin approval.",
      request: patientRequest
    });
  } catch (error) {
    console.error("Error creating patient request:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all pending requests (admin only)
router.get("/patient-requests", authMiddleware, roleCheck(["admin"]), async (req, res) => {
  try {
    const requests = await PatientRequest.find({ status: "pending" })
      .populate("user_id", "name email")
      .populate("doctor_id", "name specialization")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching patient requests:", error);
    res.status(500).json({ error: error.message });
  }
});

// Approve patient request (admin only)
router.patch("/patient-requests/:requestId/approve", authMiddleware, roleCheck(["admin"]), async (req, res) => {
  try {
    const { requestId } = req.params;
    const adminId = req.user.id;

    const request = await PatientRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    // Create Patient record
    const patient = new Patient({
      name: request.name,
      email: request.email,
      phone: request.phone,
      description: request.description,
      image: request.image,
      doctor_id: request.doctor_id
    });

    const savedPatient = await patient.save();

    // Update request status
    request.status = "approved";
    request.processed_by = adminId;
    request.patient_id = savedPatient._id;
    await request.save();

    res.json({
      message: "Patient request approved successfully",
      patient: savedPatient
    });
  } catch (error) {
    console.error("Error approving patient request:", error);
    res.status(500).json({ error: error.message });
  }
});

// Reject patient request (admin only)
router.patch("/patient-requests/:requestId/reject", authMiddleware, roleCheck(["admin"]), async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    const request = await PatientRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "rejected";
    request.processed_by = adminId;
    request.rejection_reason = reason || "No reason provided";
    await request.save();

    res.json({
      message: "Patient request rejected",
      reason: request.rejection_reason
    });
  } catch (error) {
    console.error("Error rejecting patient request:", error);
    res.status(500).json({ error: error.message });
  }
});
