🏥 Medicare Pro – Full Stack Hospital Management System
A full-stack hospital management solution built with React + Tailwind CSS (frontend) and Node.js + Express + MongoDB (backend).
System supports authentication (JWT), role-based access (Admin, Doctor, Patient, Receptionist), patient management, appointments, and doctor prescriptions.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

✨ Features
Authentication & Roles
JWT-based login/logout

Role-based navigation: Admin, Doctor, Patient, Receptionist

Patients
Add / View patients

Patient profile with medical records

Appointments
Schedule new appointments

List with status (Scheduled, Completed, Cancelled)

Patients see their own appointments

Prescriptions
Doctors can add prescriptions for appointments

Patients view prescriptions from dashboard

Dashboard
Admin: Total users, patients, appointments overview

Doctor: Upcoming appointments & prescriptions

Patient: Upcoming appointments & prescription records

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🎨 UI/UX
Built with React and Tailwind CSS

Responsive: Works on desktop & mobile

Loading states & error handling for smoother experience

🛠️ Tech Stack
Frontend:

React (Vite)

Tailwind CSS

Backend:

Node.js

Express.js

MongoDB + Mongoose ORM

JWT Authentication

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

📁 Project Structure
text
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
bash
git clone https://github.com/<your-username>/<your-repo>.git
cd medicare-pro
2. Backend Setup
bash
cd server
npm install
Create .env in server/ with:

text
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medicare
JWT_SECRET=your_jwt_secret
PORT=5000
Run backend server:

bash
npm run dev
3. Frontend Setup
bash
cd client
npm install
npm run dev
Frontend runs at http://localhost:5173 (Vite default).

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


🔑 API Endpoints
Auth
POST /api/auth/signup – Register

POST /api/auth/login – Login

POST /api/auth/logout – Logout

Patients
GET /api/patients – Get all patients

POST /api/patients – Add new patient

GET /api/patients/:id – Get patient profile

Appointments
GET /api/appointments – Get all appointments

POST /api/appointments – Create appointment

Prescriptions
POST /api/prescriptions/:appointmentId – Add prescription

GET /api/prescriptions/:appointmentId – Get prescription for appointment

GET /api/prescriptions/my – Get patient prescriptions

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


🚀 Deployment
Backend – Vercel / Render / Railway
Push backend to GitHub

Create project on Render/Railway

Add ENV variables (MONGO_URI, JWT_SECRET)

Deploy backend → note the backend API base URL

Frontend – Vercel
Push client/ to GitHub

Connect repo to Vercel

Update API base URL:
Edit client/src/utils/api.js to use deployed backend:

js
import axios from "axios";
export default axios.create({
  baseURL: "https://your-backend-url.com/api",
});
Deploy frontend, get public URL

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🧪 Testing
Postman
Import your API endpoints as a collection

Test authentication, patient CRUD, appointment creation, prescriptions

Manual Flow
Login as doctor → add prescription for an appointment

Login as patient → view prescription in dashboard

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


📌 Roadmap
✅ Authentication (JWT)

✅ Patient management

✅ Appointment management

✅ Doctor prescriptions

✅ Role-based dashboard

🔲 Advanced features: Billing, Reports, Notifications

👨‍💻 Author
Built with ❤️ by Vinayak
