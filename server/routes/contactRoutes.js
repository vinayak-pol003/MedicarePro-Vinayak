import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// Submit contact form (Public route)
router.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ 
                message: 'Name, email, and message are required fields' 
            });
        }

        const newContact = new Contact({
            name,
            email,
            message
        });

        await newContact.save();
        
        res.status(201).json({ 
            message: 'Contact form submitted successfully',
            contactId: newContact._id
        });
    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
});

// Get all contacts (Admin only) - ADD THIS ROUTE
router.get('/admin/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ 
            message: 'Error fetching contacts', 
            error: error.message 
        });
    }
});

// Update contact status (Admin only) - ADD THIS ROUTE
router.put('/admin/contacts/:id', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['unread', 'read', 'resolved'].includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status. Must be unread, read, or resolved' 
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ 
                message: 'Contact not found' 
            });
        }

        res.json(contact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ 
            message: 'Error updating contact', 
            error: error.message 
        });
    }
});

// Delete contact (Admin only) - ADD THIS ROUTE FOR ENHANCED UI
router.delete('/admin/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        
        if (!contact) {
            return res.status(404).json({ 
                message: 'Contact not found' 
            });
        }

        res.json({ 
            message: 'Contact deleted successfully',
            deletedContact: contact 
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ 
            message: 'Error deleting contact', 
            error: error.message 
        });
    }
});

export default router;
