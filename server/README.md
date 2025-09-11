Backend Readme

------------------------------------------------------------------------------------------------------------------------------------------------

Medicare Pro
This document details the backend of the Medicare Pro hospital management system, which serves as the core API for the frontend application. It's built using the MERN stack, providing a robust and scalable solution for managing hospital data.


------------------------------------------------------------------------------------------------------------------------------------------------


🛠️ Tech Stack
Node.js: A JavaScript runtime for building server-side applications.

Express.js: A fast, unopinionated, minimalist web framework for Node.js.

MongoDB: A NoSQL document database for storing application data.

Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.

JWT (JSON Web Tokens): For secure, stateless authentication.

------------------------------------------------------------------------------------------------------------------------------------------------

📁 Project Structure
The backend code is organized into a logical folder structure to ensure maintainability and scalability.

/server
├── models/             # Mongoose Schemas (User, Patient, Appointment, Prescription)
├── routes/             # API Routes
├── middleware/         # Custom Middleware (Auth, Role-based access)
├── uploads/            # File uploads directory
├── server.js           # Main server entry file
└── package.json

------------------------------------------------------------------------------------------------------------------------------------------------

⚙️ Installation and Setup
Navigate to the server folder:

Bash

cd medicare-pro/server
Install dependencies:

Bash

npm install
Create a .env file:
Create a .env file in the server directory and add the following environment variables:

------------------------------------------------------------------------------------------------------------------------------------------------

Plaintext

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medicare
JWT_SECRET=your_jwt_secret
PORT=5000
MONGO_URI: Your MongoDB connection string.

JWT_SECRET: A strong, random string for signing JWTs.

PORT: The port the server will run on.

------------------------------------------------------------------------------------------------------------------------------------------------

Run the backend server:

Bash

npm run dev
The server will start on the port specified in your .env file (default is 5000).

------------------------------------------------------------------------------------------------------------------------------------------------

🔑 API Endpoints
The following is a list of the main API endpoints provided by the backend:

Auth:

POST /api/auth/signup – Register a new user.

POST /api/auth/login – Authenticate and log in a user.

POST /api/auth/logout – Log out a user.

------------------------------------------------------------------------------------------------------------------------------------------------

Patients:

GET /api/patients – Get all patients (Admin/Receptionist).

POST /api/patients – Add a new patient.

GET /api/patients/:id – Get a single patient's profile.

------------------------------------------------------------------------------------------------------------------------------------------------

Appointments:

GET /api/appointments – Get all appointments.

POST /api/appointments – Create a new appointment.

------------------------------------------------------------------------------------------------------------------------------------------------

Prescriptions:

POST /api/prescriptions/:appointmentId – Doctors can add a prescription to a specific appointment.

GET /api/prescriptions/:appointmentId – Get a prescription for a specific appointment.

GET /api/prescriptions/my – Patients can get a list of their prescriptions.


------------------------------------------------------------------------------------------------------------------------------------------------

🚀 Deployment
You can easily deploy the backend to a cloud provider like Render or Vercel.

Push the server directory to a GitHub repository.

Create a new project on your chosen platform (e.g., Render, Railway).

Add your environment variables (MONGO_URI, JWT_SECRET) in the platform's settings.

Initiate the deployment. Once complete, the platform will provide a public API base URL that you'll use in your frontend application.