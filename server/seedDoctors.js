import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";
import User from "./models/User.js";

dotenv.config();

const sampleDoctors = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@medicare.com",
    phone: "+1-555-0101",
    specialization: "Cardiology",
    experience: 10,
    qualification: "MD, PhD in Cardiology",
    bio: "Specialized in heart diseases and cardiovascular surgery with over 10 years of experience.",
    consultation_fee: 150,
    availability: {
      monday: { start: "09:00", end: "17:00", available: true },
      tuesday: { start: "09:00", end: "17:00", available: true },
      wednesday: { start: "09:00", end: "17:00", available: true },
      thursday: { start: "09:00", end: "17:00", available: true },
      friday: { start: "09:00", end: "15:00", available: true },
      saturday: { start: "10:00", end: "14:00", available: true },
      sunday: { start: "", end: "", available: false }
    }
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@medicare.com",
    phone: "+1-555-0102",
    specialization: "Neurology",
    experience: 8,
    qualification: "MD, Neurology Specialist",
    bio: "Expert in neurological disorders and brain surgery.",
    consultation_fee: 180,
    availability: {
      monday: { start: "08:00", end: "16:00", available: true },
      tuesday: { start: "08:00", end: "16:00", available: true },
      wednesday: { start: "08:00", end: "16:00", available: true },
      thursday: { start: "08:00", end: "16:00", available: true },
      friday: { start: "08:00", end: "14:00", available: true },
      saturday: { start: "", end: "", available: false },
      sunday: { start: "", end: "", available: false }
    }
  },
  {
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@medicare.com",
    phone: "+1-555-0103",
    specialization: "Pediatrics",
    experience: 12,
    qualification: "MD, Pediatric Specialist",
    bio: "Dedicated to children's health and development with extensive experience in pediatric care.",
    consultation_fee: 120,
    availability: {
      monday: { start: "09:00", end: "18:00", available: true },
      tuesday: { start: "09:00", end: "18:00", available: true },
      wednesday: { start: "09:00", end: "18:00", available: true },
      thursday: { start: "09:00", end: "18:00", available: true },
      friday: { start: "09:00", end: "16:00", available: true },
      saturday: { start: "10:00", end: "15:00", available: true },
      sunday: { start: "", end: "", available: false }
    }
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@medicare.com",
    phone: "+1-555-0104",
    specialization: "Orthopedics",
    experience: 15,
    qualification: "MD, Orthopedic Surgeon",
    bio: "Specialized in bone and joint disorders, sports medicine, and orthopedic surgery.",
    consultation_fee: 200,
    availability: {
      monday: { start: "07:00", end: "15:00", available: true },
      tuesday: { start: "07:00", end: "15:00", available: true },
      wednesday: { start: "07:00", end: "15:00", available: true },
      thursday: { start: "07:00", end: "15:00", available: true },
      friday: { start: "07:00", end: "13:00", available: true },
      saturday: { start: "", end: "", available: false },
      sunday: { start: "", end: "", available: false }
    }
  },
  {
    name: "Dr. Lisa Thompson",
    email: "lisa.thompson@medicare.com",
    phone: "+1-555-0105",
    specialization: "Dermatology",
    experience: 6,
    qualification: "MD, Dermatology Specialist",
    bio: "Expert in skin conditions, cosmetic dermatology, and skin cancer treatment.",
    consultation_fee: 140,
    availability: {
      monday: { start: "10:00", end: "18:00", available: true },
      tuesday: { start: "10:00", end: "18:00", available: true },
      wednesday: { start: "10:00", end: "18:00", available: true },
      thursday: { start: "10:00", end: "18:00", available: true },
      friday: { start: "10:00", end: "16:00", available: true },
      saturday: { start: "09:00", end: "13:00", available: true },
      sunday: { start: "", end: "", available: false }
    }
  }
];

async function seedDoctors() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log("Cleared existing doctors");

    // Get existing users with doctor role
    const doctorUsers = await User.find({ role: "doctor" });
    console.log(`Found ${doctorUsers.length} doctor users`);

    // Create doctors linked to existing users
    const createdDoctors = [];
    for (let i = 0; i < sampleDoctors.length && i < doctorUsers.length; i++) {
      const doctorData = {
        ...sampleDoctors[i],
        user_id: doctorUsers[i]._id
      };
      
      const doctor = new Doctor(doctorData);
      await doctor.save();
      createdDoctors.push(doctor);
      console.log(`Created doctor: ${doctor.name}`);
    }

    // If we have more sample doctors than users, create additional users
    if (sampleDoctors.length > doctorUsers.length) {
      for (let i = doctorUsers.length; i < sampleDoctors.length; i++) {
        const sampleDoctor = sampleDoctors[i];
        
        // Create a new user for this doctor
        const newUser = new User({
          name: sampleDoctor.name,
          email: sampleDoctor.email,
          password: "$2b$10$example.hash.for.password", // This would be hashed in real scenario
          role: "doctor"
        });
        await newUser.save();
        
        // Create the doctor profile
        const doctorData = {
          ...sampleDoctor,
          user_id: newUser._id
        };
        
        const doctor = new Doctor(doctorData);
        await doctor.save();
        createdDoctors.push(doctor);
        console.log(`Created user and doctor: ${doctor.name}`);
      }
    }

    console.log(`Successfully seeded ${createdDoctors.length} doctors`);
    
  } catch (error) {
    console.error("Error seeding doctors:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedDoctors();
