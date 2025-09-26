🏥 Medicare Pro – Full Stack Hospital Management System
A full-stack hospital management solution built with React + Tailwind CSS (frontend) and Node.js + Express + MongoDB (backend).
Now supports secure ImageKit cloud storage for patient and doctor profile images.
System supports authentication (JWT), role-based access (Admin, Doctor, Patient, Receptionist), patient management, appointments, doctor prescriptions, and cloud image hosting.

---------------------------------------------------------------------------------------------------------------------------------------------

✨ Features

Authentication & Roles

JWT-based login/logout

Role-based navigation: Admin, Doctor, Patient, Receptionist

Patients

Add / View patients

Patient profile with medical records and cloud-stored profile image (ImageKit)

Appointments

Schedule new appointments

List with status (Scheduled, Completed, Cancelled)

Patients see their own appointments

Prescriptions

Doctors can add prescriptions for appointments

Patients view prescriptions from dashboard

Cloud Image Storage

Upload and serve patient and doctor profile images directly from ImageKit CDN

No local storage; instant image access and management

Dashboard

Admin: Total users, patients, appointments overview

Doctor: Upcoming appointments & prescriptions

Patient: Upcoming appointments & prescription records

---------------------------------------------------------------------------------------------------------------------------------------------

🎨 UI/UX

Built with React and Tailwind CSS

Responsive: Works on desktop & mobile

Smooth loading states & error handling

---------------------------------------------------------------------------------------------------------------------------------------------

🛠️ Tech Stack

Frontend:
React (Vite), Tailwind CSS

Backend:
Node.js, Express.js, MongoDB + Mongoose, JWT Authentication

Cloud Storage:
ImageKit cloud CDN for images

---------------------------------------------------------------------------------------------------------------------------------------------

📁 Project Structure

text
/medicare-pro
 ├── client/                 # React Frontend
 │   ├── src/
 │   │   ├── pages/          # Pages (Login, Dashboard, Patients, Appointments)
 │   │   ├── components/     # UI Components
 │   │   ├── context/        # Auth Context
 │   │   └── utils/          # Axios & ImageKit setup
 │   └── package.json
 │
 ├── server/                 # Node.js Backend
 │   ├── models/             # Mongoose Models (User, Patient, Appointment, Prescription, Doctor)
 │   ├── routes/             # API Routes
 │   ├── middleware/         # Auth & Role Middleware
 │   ├── server.js           # Main server file
 │   └── package.json
 │
 ├── .gitignore
 ├── README.md
 └── .env

 ---------------------------------------------------------------------------------------------------------------------------------------------

⚙️ Installation & Setup

Clone Repository

bash
git clone https://github.com/<your-username>/<your-repo>.git
cd medicare-pro
Backend Setup

bash
cd server
npm install
Create .env in server/ with:

text
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medicare
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<your_imagekit_id>
PORT=5000
Run backend server:

bash
npm run dev
Frontend Setup

bash
cd client
npm install
npm run dev
Frontend runs at http://localhost:5173 (Vite default).

🔑 API Endpoints
Auth
POST /api/auth/signup – Register
POST /api/auth/login – Login
POST /api/auth/logout – Logout

Patients
GET /api/patients – Get all patients
POST /api/patients – Add new patient (with ImageKit CDN url)
GET /api/patients/:id – Get patient profile

Doctors
GET /api/doctors – Get all doctors
POST /api/doctors – Add new doctor (with ImageKit CDN url)
GET /api/doctors/:id – Get doctor profile

Appointments
GET /api/appointments – Get all appointments
POST /api/appointments – Create appointment

Prescriptions
POST /api/prescriptions/:appointmentId – Add prescription
GET /api/prescriptions/:appointmentId – Get prescription for appointment
GET /api/prescriptions/my – Get patient prescriptions

Cloud ImageKit
GET /api/imagekit-auth – Get authentication parameters for cloud upload

---------------------------------------------------------------------------------------------------------------------------------------------

🚀 Deployment
Backend – Vercel / Render / Railway
Frontend – Vercel
ImageKit handles image hosting automatically—no extra setup needed.

---------------------------------------------------------------------------------------------------------------------------------------------

🧪 Testing
Use Postman for API testing
Test image upload flow by adding new patients/doctors
Verify cloud profile images appear on dashboards and lists

---------------------------------------------------------------------------------------------------------------------------------------------

📌 Roadmap
✅ JWT Authentication
✅ Patient management
✅ Appointment management
✅ Doctor prescriptions
✅ Role-based dashboard
✅ ImageKit cloud image support

👨‍💻 Author
Built with ❤️ by Vinayak