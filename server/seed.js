import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Patient from "./models/Patient.js";
import Appointment from "./models/Appointment.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear old data
    await User.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();

    // Users with plain passwords
    const usersPlain = [
      { name: "Admin User", email: "admin@medicare.com", password: "admin123", role: "admin" },
      { name: "Dr. Smith", email: "doctor@medicare.com", password: "doc123", role: "doctor" },
      { name: "Receptionist", email: "reception@medicare.com", password: "rec123", role: "receptionist" }
    ];

    // Hash passwords before inserting users
    const usersHashed = await Promise.all(
      usersPlain.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const users = await User.insertMany(usersHashed);

    // Patients linked to doctor user
    const patients = await Patient.insertMany([
      { name: "John Doe", email: "john@example.com", phone: "1234567890", doctor_id: users[1]._id },
      { name: "Jane Roe", email: "jane@example.com", phone: "9876543210", doctor_id: users[1]._id }
    ]);

    // Appointments linked to patients and doctor
    await Appointment.insertMany([
      { patient_id: patients[0]._id, doctor_id: users[1]._id, date: new Date(), time: "10:00 AM", status: "scheduled" },
      { patient_id: patients[1]._id, doctor_id: users[1]._id, date: new Date(), time: "02:00 PM", status: "scheduled" }
    ]);

    console.log("✅ Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();
