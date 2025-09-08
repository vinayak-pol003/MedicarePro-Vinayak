# Medicare Pro

🏥 Medicare Pro – Full Stack Hospital Management System

A full-stack hospital management system built with React + Tailwind CSS (frontend) and Node.js + Express + MongoDB (backend). The app supports authentication (JWT), role-based access (Admin, Doctor, Patient, Receptionist), patients management, appointments, and doctor prescriptions.

✨ Features
👩‍⚕️ Core Features

Authentication & Roles

JWT-based login/logout

Role-based navigation (Admin, Doctor, Patient, Receptionist)

Patients

Add / View patients

Patient profile with medical records

Appointments

Schedule new appointments

List of appointments with status (Scheduled, Completed, Cancelled)

Patients can see their appointments

Prescriptions

Doctors can add prescriptions for appointments

Patients can view their prescriptions in dashboard

Dashboard

Admin: total users, patients, appointments overview

Doctor: upcoming appointments & prescriptions

Patient: upcoming appointments & prescription records

🎨 UI/UX

Built with React + TailwindCSS

Responsive design for desktop & mobile

Loading states & error handling

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

Backend

Node.js

Express.js

MongoDB + Mongoose ORM

JWT Authentication

📂 Project Structure
/medicare-pro
 ├── client/                # React Frontend
 │   ├── src/
 │   │   ├── pages/         # Pages (Login, Dashboard, Patients, Appointments)
 │   │   ├── components/    # UI Components
 │   │   ├── context/       # Auth Context
 │   │   └── utils/         # Axios API setup
 │   └── package.json
 │
 ├── server/                # Node.js Backend
 │   ├── models/            # Mongoose Models (User, Patient, Appointment, Prescription)
 │   ├── routes/            # API Routes
 │   ├── middleware/        # Auth & Role Middleware
 │   ├── uploads/           # File uploads
 │   ├── server.js          # Main server file
 │   └── package.json
 │
 ├── .gitignore
 ├── README.md
 └── .env

⚙️ Installation & Setup
1. Clone Repository
git clone https://github.com/<your-username>/<your-repo>.git
cd medicare-pro

2. Backend Setup
cd server
npm install


Create a .env file inside server/ with:

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medicare
JWT_SECRET=your_jwt_secret
PORT=5000


Run backend:

npm run dev

3. Frontend Setup
cd client
npm install
npm run dev

🔑 API Endpoints
Auth

POST /api/auth/signup – Register

POST /api/auth/login – Login

POST /api/auth/logout – Logout

Patients

GET /api/patients – Get all patients

POST /api/patients – Add new patient

GET /api/patients/:id – Patient profile

Appointments

GET /api/appointments – Get all appointments

POST /api/appointments – Create appointment

Prescriptions

POST /api/prescriptions/:appointmentId – Doctor adds prescription

GET /api/prescriptions/:appointmentId – Get prescription for appointment

GET /api/prescriptions/my – Patient gets all their prescriptions

🚀 Deployment
Backend – Vercel / Render / Railway

Push backend to GitHub

Create account on Render
 or Railway

Add environment variables (MONGO_URI, JWT_SECRET)

Deploy backend → get API base URL

Frontend – Vercel

Push frontend (client/) to GitHub

Connect repo to Vercel

In client/src/utils/api.js, update baseURL to deployed backend:

import axios from "axios";
export default axios.create({
  baseURL: "https://your-backend-url.com/api",
});


Deploy → get frontend URL

🧪 Testing
Postman

Import API collection

Test login, patients, appointments, prescriptions

Manual Flow

Login as doctor → add prescription to appointment

Login as patient → view prescription in dashboard

📌 Roadmap

✅ Authentication (JWT)
✅ Patient management
✅ Appointment management
✅ Doctor prescriptions
✅ Role-based dashboard
🔲 Advanced features: Billing, Reports, Notifications

👨‍💻 Author

Built with ❤️ by [Your Name]