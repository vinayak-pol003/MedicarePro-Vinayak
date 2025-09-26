// models/Contact.js
import mongoose from "mongoose";

const ContactSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'resolved'],
        default: 'unread'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact; // ← This is the key line
