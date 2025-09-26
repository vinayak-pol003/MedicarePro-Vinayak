// routes/contactRoutes.js  (ES-module version)
import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

/*  POST /api/contact  */
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required fields",
      });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("POST /contact error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/*  GET /api/admin/contacts  */
router.get("/admin/contacts", async (_req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error("GET /admin/contacts error:", error);
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

/*  PUT /api/admin/contacts/:id  */
router.put("/admin/contacts/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    console.error("PUT /admin/contacts/:id error:", error);
    res.status(500).json({ message: "Error updating contact" });
  }
});

export default router;
