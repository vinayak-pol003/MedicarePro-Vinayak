Medicare Pro Backend
This document details the backend for the Medicare Pro hospital management system—the secure, scalable API serving your hospital data and workflows. Built with Node.js, Express, MongoDB, Mongoose, and now integrated with ImageKit cloud storage for profile images.

-----------------------------------------------------------------------------------------------------------------------------------------

🛠️ Tech Stack
Node.js: Server-side runtime

Express.js: Minimalist web framework

MongoDB: NoSQL cloud database

Mongoose: ODM for schema modeling

JWT (JSON Web Tokens): Stateless authentication

ImageKit: Secure cloud CDN for patient/doctor images

---------------------------------------------------------------------------------------------------------------------------------------

📁 Project Structure
text
/server
├── models/             # Mongoose Schemas (User, Patient, Doctor, Appointment, Prescription)
├── routes/             # API Route handlers
├── middleware/         # Auth & role middleware
├── index.js            # Main server entry point
└── package.json
(Removed local uploads directory—now using ImageKit cloud delivery)


---------------------------------------------------------------------------------------------------------------------------------------

⚙️ Installation and Setup
Navigate to the server folder:

bash
cd medicare-pro/server
Install dependencies:

bash
npm install
Create a .env file with:

text
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medicare
JWT_SECRET=your_jwt_secret
PORT=5000
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<your_imagekit_id>
MONGO_URI: Your cloud MongoDB URI

JWT_SECRET: Use a secure random string

PORT: Server port

IMAGEKIT_PUBLIC_KEY / PRIVATE_KEY / URL_ENDPOINT: Get these from your ImageKit account

Run backend server:

bash
npm run dev
Server starts at your defined port (default: 5000).


---------------------------------------------------------------------------------------------------------------------------------------

🔑 Main API Endpoints
Auth

POST /api/auth/signup — Register user

POST /api/auth/login — Authenticate/login

POST /api/auth/logout — Logout user

Patients

GET /api/patients — List all patients

POST /api/patients — Add new patient (accepts image field as ImageKit CDN URL)

GET /api/patients/:id — Patient profile

Doctors

GET /api/doctors — List doctors

POST /api/doctors — Add doctor (accepts image field as ImageKit CDN URL)

GET /api/doctors/:id — Doctor profile

Appointments

GET /api/appointments — All appointments

POST /api/appointments — Create appointment

Prescriptions

POST /api/prescriptions/:appointmentId — Doctor adds prescription

GET /api/prescriptions/:appointmentId — Get prescription by appointment

GET /api/prescriptions/my — Patient’s prescriptions

ImageKit Cloud

GET /api/imagekit-auth — Frontend uses this to securely upload images to ImageKit CDN

---------------------------------------------------------------------------------------------------------------------------------------

🚀 Deployment
Push /server to your GitHub repo

Create a Render/Railway/Vercel project for the backend

Add all env variables in the platform’s settings (MONGO_URI, JWT_SECRET, IMAGEKIT keys)

Deploy — platform will provide a public API base URL for your frontend