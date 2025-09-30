import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Patient from "./models/Patient.js";
import Appointment from "./models/Appointment.js";
import Doctor from "./models/Doctor.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear old data
    await User.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();
    await Doctor.deleteMany();

    console.log("🗑️  Cleared existing data...\n");

    // ============= CREATE USERS =============
    const usersPlain = [
      { name: "Admin User", email: "admin@medicare.com", password: "admin123", role: "admin" },
      { name: "Dr. Lisa Anderson", email: "lisa@gmail.com", password: "1230", role: "doctor" },
      { name: "Dr. Emily Johnson", email: "emily@gmail.com", password: "1230", role: "doctor" },
      { name: "Chand", email: "chand@gmail.com", password: "1230", role: "admin" },
    ];

    const usersHashed = await Promise.all(
      usersPlain.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const users = await User.insertMany(usersHashed);
    console.log(`✅ Created ${users.length} users`);

    // ============= CREATE DOCTOR PROFILES =============
    const doctors = await Doctor.insertMany([
      {
        name: "Dr. Lisa Anderson",
        email: "lisa@gmail.com",
        phone: "9876543210",
        specialization: "General Medicine",
        qualification: "MBBS, MD",
        experience: 12,
        consultation_fee: 600,
        bio: "Experienced general physician specializing in preventive care and chronic disease management.",
        is_active: true,
        availability: {
          monday: { start: "09:00", end: "17:00", available: true },
          tuesday: { start: "09:00", end: "17:00", available: true },
          wednesday: { start: "09:00", end: "17:00", available: true },
          thursday: { start: "09:00", end: "17:00", available: true },
          friday: { start: "09:00", end: "17:00", available: true },
          saturday: { start: "09:00", end: "13:00", available: true },
          sunday: { start: "", end: "", available: false }
        }
      },
      {
        name: "Dr. Emily Johnson",
        email: "emily@gmail.com",
        phone: "9123456789",
        specialization: "Cardiology",
        qualification: "MBBS, MD (Cardiology), DM",
        experience: 8,
        consultation_fee: 800,
        bio: "Cardiologist with expertise in heart diseases, hypertension, and cardiovascular health.",
        is_active: true,
        availability: {
          monday: { start: "10:00", end: "18:00", available: true },
          tuesday: { start: "10:00", end: "18:00", available: true },
          wednesday: { start: "10:00", end: "18:00", available: true },
          thursday: { start: "10:00", end: "18:00", available: true },
          friday: { start: "10:00", end: "18:00", available: true },
          saturday: { start: "", end: "", available: false },
          sunday: { start: "", end: "", available: false }
        }
      }
    ]);

    console.log(`✅ Created ${doctors.length} doctor profiles`);

    // ============= CREATE PATIENTS BY MONTH =============
    const patientsData = [];
    
    // January 2025 - 3 patients
    patientsData.push(
      { name: "Rajesh Kumar", email: "rajesh@example.com", phone: "9876543211", description: "Regular checkup patient", doctor_id: doctors[1]._id, createdAt: new Date(2025, 0, 15) },
      { name: "Priya Sharma", email: "priya@example.com", phone: "9876543212", description: "Cardiac patient", doctor_id: doctors[1]._id, createdAt: new Date(2025, 0, 20) },
      { name: "Amit Patel", email: "amit@example.com", phone: "9876543213", description: "Hypertension monitoring", doctor_id: doctors[1]._id, createdAt: new Date(2025, 0, 25) }
    );

    // February 2025 - 4 patients
    patientsData.push(
      { name: "Sneha Reddy", email: "sneha@example.com", phone: "9876543214", description: "Heart disease follow-up", doctor_id: doctors[1]._id, createdAt: new Date(2025, 1, 5) },
      { name: "Vikram Singh", email: "vikram@example.com", phone: "9876543215", description: "Chest pain consultation", doctor_id: doctors[1]._id, createdAt: new Date(2025, 1, 10) },
      { name: "Anita Desai", email: "anita@example.com", phone: "9876543216", description: "Preventive cardiology", doctor_id: doctors[1]._id, createdAt: new Date(2025, 1, 15) },
      { name: "Karthik Menon", email: "karthik@example.com", phone: "9876543217", description: "Post-surgery follow-up", doctor_id: doctors[1]._id, createdAt: new Date(2025, 1, 25) }
    );

    // March 2025 - 8 patients
    patientsData.push(
      { name: "Deepa Nair", email: "deepa@example.com", phone: "9876543218", description: "ECG consultation", doctor_id: doctors[1]._id, createdAt: new Date(2025, 2, 3) },
      { name: "Ravi Krishnan", email: "ravi@example.com", phone: "9876543219", description: "Cardiac stress test", doctor_id: doctors[1]._id, createdAt: new Date(2025, 2, 7) },
      { name: "Meera Iyer", email: "meera@example.com", phone: "9876543220", description: "Blood pressure management", doctor_id: doctors[1]._id, createdAt: new Date(2025, 2, 10) },
      { name: "Suresh Babu", email: "suresh@example.com", phone: "9876543221", description: "Cholesterol treatment", doctor_id: doctors[1]._id, createdAt: new Date(2025, 2, 14) },
      { name: "Lakshmi Devi", email: "lakshmi@example.com", phone: "9876543222", description: "Heart rhythm consultation", doctor_id: doctors[1]._id, createdAt: new Date(2025, 2, 18) },
      { name: "Arun Kumar", email: "arun@example.com", phone: "9876543223", description: "Angina treatment", doctor_id: doctors[1]._id, createdAt: new Date(2025, 2, 22) },
      { name: "Divya Pillai", email: "divya@example.com", phone: "9876543224", description: "Cardiac rehabilitation", doctor_id: doctors[1]._id, createdAt: new Date(2025, 2, 26) },
      { name: "Sanjay Verma", email: "sanjay@example.com", phone: "9876543225", description: "Preventive health checkup", doctor_id: doctors[1]._id, createdAt: new Date(2025, 2, 30) }
    );

    // April 2025 - 2 patients
    patientsData.push(
      { name: "Pooja Gupta", email: "pooja@example.com", phone: "9876543226", description: "Heart valve consultation", doctor_id: doctors[1]._id, createdAt: new Date(2025, 3, 8) },
      { name: "Naveen Reddy", email: "naveen@example.com", phone: "9876543227", description: "Cardiac CT scan follow-up", doctor_id: doctors[1]._id, createdAt: new Date(2025, 3, 22) }
    );

    // May 2025 - 5 patients
    patientsData.push(
      { name: "Kavita Shah", email: "kavita@example.com", phone: "9876543228", description: "Arrhythmia treatment", doctor_id: doctors[1]._id, createdAt: new Date(2025, 4, 5) },
      { name: "Manoj Kumar", email: "manoj@example.com", phone: "9876543229", description: "Heart disease screening", doctor_id: doctors[1]._id, createdAt: new Date(2025, 4, 12) },
      { name: "Rekha Rao", email: "rekha@example.com", phone: "9876543230", description: "Pacemaker follow-up", doctor_id: doctors[1]._id, createdAt: new Date(2025, 4, 18) },
      { name: "Harish Joshi", email: "harish@example.com", phone: "9876543231", description: "Bypass surgery consultation", doctor_id: doctors[1]._id, createdAt: new Date(2025, 4, 23) },
      { name: "Nandini Murthy", email: "nandini@example.com", phone: "9876543232", description: "Cardiomyopathy treatment", doctor_id: doctors[1]._id, createdAt: new Date(2025, 4, 29) }
    );

    // June 2025 - 2 patients
    patientsData.push(
      { name: "Ramesh Verma", email: "ramesh@example.com", phone: "9876543233", description: "Blood pressure monitoring", doctor_id: doctors[1]._id, createdAt: new Date(2025, 5, 8) },
      { name: "Shalini Kapoor", email: "shalini@example.com", phone: "9876543234", description: "Heart palpitations", doctor_id: doctors[1]._id, createdAt: new Date(2025, 5, 22) }
    );

    // July 2025 - 3 patients
    patientsData.push(
      { name: "Gopal Krishna", email: "gopal@example.com", phone: "9876543235", description: "Coronary artery disease", doctor_id: doctors[1]._id, createdAt: new Date(2025, 6, 5) },
      { name: "Sangeeta Rao", email: "sangeeta@example.com", phone: "9876543236", description: "Echocardiogram follow-up", doctor_id: doctors[1]._id, createdAt: new Date(2025, 6, 15) },
      { name: "Vijay Kumar", email: "vijay@example.com", phone: "9876543237", description: "Atrial fibrillation treatment", doctor_id: doctors[1]._id, createdAt: new Date(2025, 6, 25) }
    );

    // August 2025 - 5 patients
    patientsData.push(
      { name: "Radha Krishnan", email: "radha@example.com", phone: "9876543238", description: "Congestive heart failure", doctor_id: doctors[1]._id, createdAt: new Date(2025, 7, 3) },
      { name: "Ashok Mehta", email: "ashok@example.com", phone: "9876543239", description: "Valve replacement consultation", doctor_id: doctors[1]._id, createdAt: new Date(2025, 7, 10) },
      { name: "Sunita Reddy", email: "sunita@example.com", phone: "9876543240", description: "Peripheral artery disease", doctor_id: doctors[1]._id, createdAt: new Date(2025, 7, 17) },
      { name: "Prakash Rao", email: "prakash@example.com", phone: "9876543241", description: "Cardiac catheterization", doctor_id: doctors[1]._id, createdAt: new Date(2025, 7, 24) },
      { name: "Geetha Nair", email: "geetha@example.com", phone: "9876543242", description: "Myocardial infarction recovery", doctor_id: doctors[1]._id, createdAt: new Date(2025, 7, 30) }
    );

    // September 2025 - 6 patients
    patientsData.push(
      { name: "Kiran Kumar", email: "kiran@example.com", phone: "9876543243", description: "Angioplasty follow-up", doctor_id: doctors[1]._id, createdAt: new Date(2025, 8, 2) },
      { name: "Manjula Devi", email: "manjula@example.com", phone: "9876543244", description: "Heart murmur evaluation", doctor_id: doctors[1]._id, createdAt: new Date(2025, 8, 8) },
      { name: "Balaji Swamy", email: "balaji@example.com", phone: "9876543245", description: "Stress test required", doctor_id: doctors[1]._id, createdAt: new Date(2025, 8, 12) },
      { name: "Kamala Subramaniam", email: "kamala@example.com", phone: "9876543246", description: "Lipid profile management", doctor_id: doctors[1]._id, createdAt: new Date(2025, 8, 18) },
      { name: "Murali Mohan", email: "murali@example.com", phone: "9876543247", description: "Ventricular tachycardia", doctor_id: doctors[1]._id, createdAt: new Date(2025, 8, 23) },
      { name: "Shanti Pillai", email: "shanti@example.com", phone: "9876543248", description: "Heart failure management", doctor_id: doctors[1]._id, createdAt: new Date(2025, 8, 28) }
    );

    const patients = await Patient.insertMany(patientsData);
    console.log(`✅ Created ${patients.length} patients (Jan-Sep 2025)`);

    // ============= CREATE APPOINTMENTS =============
    const appointmentsData = [];
    const times = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

    // Helper function to generate random appointments
    const generateRandomAppointments = (startDate, endDate, count) => {
      const appointments = [];
      const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      for (let i = 0; i < count; i++) {
        const randomDays = Math.floor(Math.random() * daysDiff);
        const appointmentDate = new Date(startDate.getTime() + randomDays * 24 * 60 * 60 * 1000);
        const patientIndex = Math.floor(Math.random() * patients.length);
        const timeIndex = Math.floor(Math.random() * times.length);
        
        let status;
        const today = new Date(2025, 8, 30); // Sep 30, 2025
        if (appointmentDate < today) {
          status = Math.random() > 0.2 ? "completed" : "cancelled";
        } else {
          status = "scheduled";
        }
        
        appointments.push({
          patient_id: patients[patientIndex]._id,
          doctor_id: doctors[1]._id, // Dr. Emily
          date: appointmentDate,
          time: times[timeIndex],
          status: status,
          rating: status === "completed" ? Math.floor(Math.random() * 3) + 3 : null,
          prescription: null
        });
      }
      
      return appointments;
    };

    // Generate random appointments for Jan-Sep
    appointmentsData.push(...generateRandomAppointments(new Date(2025, 0, 1), new Date(2025, 0, 31), 6));   // Jan: 6
    appointmentsData.push(...generateRandomAppointments(new Date(2025, 1, 1), new Date(2025, 1, 28), 7));   // Feb: 7
    appointmentsData.push(...generateRandomAppointments(new Date(2025, 2, 1), new Date(2025, 2, 31), 10));  // Mar: 10
    appointmentsData.push(...generateRandomAppointments(new Date(2025, 3, 1), new Date(2025, 3, 30), 5));   // Apr: 5
    appointmentsData.push(...generateRandomAppointments(new Date(2025, 4, 1), new Date(2025, 4, 31), 8));   // May: 8
    appointmentsData.push(...generateRandomAppointments(new Date(2025, 5, 1), new Date(2025, 5, 30), 6));   // Jun: 6
    appointmentsData.push(...generateRandomAppointments(new Date(2025, 6, 1), new Date(2025, 6, 31), 7));   // Jul: 7
    appointmentsData.push(...generateRandomAppointments(new Date(2025, 7, 1), new Date(2025, 7, 31), 6));   // Aug: 6
    appointmentsData.push(...generateRandomAppointments(new Date(2025, 8, 1), new Date(2025, 8, 27), 6));   // Sep 1-27: 6

    // ============= CURRENT WEEK APPOINTMENTS (Sep 28 - Oct 4, 2025) ⭐ =============
    // Specific appointments for the current week with detailed schedule
    const currentWeekAppointments = [
      // Saturday, Sep 28 - Weekend, Dr. Emily not available
      
      // Sunday, Sep 29 - Weekend, Dr. Emily not available
      
      // Monday, Sep 30 (TODAY)
      { patient_id: patients[0]._id, doctor_id: doctors[1]._id, date: new Date(2025, 8, 30), time: "10:00", status: "completed", rating: 5, prescription: null },
      { patient_id: patients[5]._id, doctor_id: doctors[1]._id, date: new Date(2025, 8, 30), time: "11:00", status: "completed", rating: 4, prescription: null },
      { patient_id: patients[10]._id, doctor_id: doctors[1]._id, date: new Date(2025, 8, 30), time: "14:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[15]._id, doctor_id: doctors[1]._id, date: new Date(2025, 8, 30), time: "16:00", status: "scheduled", rating: null, prescription: null },
      
      // Tuesday, Oct 1
      { patient_id: patients[2]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 1), time: "10:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[7]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 1), time: "11:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[12]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 1), time: "15:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[20]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 1), time: "17:00", status: "scheduled", rating: null, prescription: null },
      
      // Wednesday, Oct 2
      { patient_id: patients[4]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 2), time: "10:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[9]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 2), time: "12:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[14]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 2), time: "14:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[18]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 2), time: "16:00", status: "scheduled", rating: null, prescription: null },
      
      // Thursday, Oct 3
      { patient_id: patients[3]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 3), time: "11:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[8]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 3), time: "14:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[13]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 3), time: "15:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[22]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 3), time: "17:00", status: "scheduled", rating: null, prescription: null },
      
      // Friday, Oct 4
      { patient_id: patients[6]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 4), time: "10:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[11]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 4), time: "11:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[16]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 4), time: "15:00", status: "scheduled", rating: null, prescription: null },
      { patient_id: patients[21]._id, doctor_id: doctors[1]._id, date: new Date(2025, 9, 4), time: "16:00", status: "scheduled", rating: null, prescription: null },
    ];

    appointmentsData.push(...currentWeekAppointments);

    const appointments = await Appointment.insertMany(appointmentsData);
    console.log(`✅ Created ${appointments.length} appointments for Dr. Emily`);

    // ============= SUMMARY =============
    console.log("\n" + "=".repeat(60));
    console.log("📊 DATABASE SEEDING SUMMARY");
    console.log("=".repeat(60));
    console.log(`\n👤 Users: ${users.length}`);
    console.log(`   - Admins: 2 (admin@medicare.com, chand@gmail.com)`);
    console.log(`   - Doctors: 2 (lisa@gmail.com, emily@gmail.com)`);
    
    console.log(`\n👨‍⚕️ Doctor Profiles: ${doctors.length}`);
    console.log(`   - Dr. Lisa Anderson (General Medicine)`);
    console.log(`   - Dr. Emily Johnson (Cardiology)`);
    
    console.log(`\n👥 Patients: ${patients.length}`);
    console.log(`   - January 2025: 3 patients`);
    console.log(`   - February 2025: 4 patients`);
    console.log(`   - March 2025: 8 patients`);
    console.log(`   - April 2025: 2 patients`);
    console.log(`   - May 2025: 5 patients`);
    console.log(`   - June 2025: 2 patients`);
    console.log(`   - July 2025: 3 patients`);
    console.log(`   - August 2025: 5 patients`);
    console.log(`   - September 2025: 6 patients`);
    
    console.log(`\n📅 Appointments: ${appointments.length} (for Dr. Emily)`);
    console.log(`   - Random appointments (Jan 1 - Sep 27): ${appointments.length - currentWeekAppointments.length}`);
    console.log(`   - Current week (Sep 28 - Oct 4): ${currentWeekAppointments.length}`);
    console.log(`   - Completed: ${appointments.filter(a => a.status === 'completed').length}`);
    console.log(`   - Scheduled: ${appointments.filter(a => a.status === 'scheduled').length}`);
    console.log(`   - Cancelled: ${appointments.filter(a => a.status === 'cancelled').length}`);
    
    console.log("\n📆 Current Week Schedule (Sep 28 - Oct 4, 2025):");
    console.log(`   - Monday, Sep 30: 4 appointments (2 completed, 2 scheduled)`);
    console.log(`   - Tuesday, Oct 1: 4 appointments (all scheduled)`);
    console.log(`   - Wednesday, Oct 2: 4 appointments (all scheduled)`);
    console.log(`   - Thursday, Oct 3: 4 appointments (all scheduled)`);
    console.log(`   - Friday, Oct 4: 4 appointments (all scheduled)`);
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60) + "\n");
    
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();
