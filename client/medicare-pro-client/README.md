Frontend Readme: 
Medicare Pro
This document outlines the frontend part of the Medicare Pro hospital management system. The frontend is a single-page application built with React and styled using Tailwind CSS. It provides a user-friendly interface for different roles (Admin, Doctor, Patient, Receptionist) to interact with the backend API.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

💻 Technologies Used
React (Vite): A JavaScript library for building user interfaces, used with Vite for a fast development experience.

Tailwind CSS: A utility-first CSS framework for rapidly building custom designs.

Axios: A promise-based HTTP client for making API requests to the backend.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

✨ Key Features
Authentication & Roles:

Secure JWT-based login and logout functionality.

Dynamic navigation and dashboard views based on user roles (Admin, Doctor, Patient, Receptionist).

Patient Dashboard:

Patients can view their upcoming appointments and access their medical records, including prescriptions.

Appointment Management:

Users can schedule appointments, and view them with their status (Scheduled, Completed, Cancelled).

Doctor's Interface:

A dedicated dashboard for doctors to view their upcoming appointments and add prescriptions for their patients.

Chat with AI:

A dedicated "Chat with AI" page powered by the Gemini API to provide an interactive and helpful assistant for users.

Responsive UI:

The entire application is built with a responsive design using Tailwind CSS, ensuring it works seamlessly on both desktop and mobile devices.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🗺️ Hospital Location
You can find the location of our hospital here:

<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.253046772744!2d-73.98785468459424!3d40.74844037932795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2596d11e86053%3A0x600b21a8141f173b!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1628167819890!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>


----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

⚙️ Installation and Setup
Navigate to the client folder:

Bash

cd medicare-pro/client
Install dependencies:

Bash

npm install
Run the development server:

Bash

npm run dev
The application will run on http://localhost:5173.


----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


🚀 Deployment
The frontend can be easily deployed using platforms like Vercel.

Push the client folder to a GitHub repository.

Connect your repository to Vercel.

Update the API Base URL: Before deploying, ensure the baseURL in your Axios configuration points to your deployed backend API.

Open client/src/utils/api.js.

Change the baseURL to your backend URL:

JavaScript

import axios from "axios";
export default axios.create({
  baseURL: "https://your-backend-url.com/api",
});
Deploy the project. Vercel will provide a public URL for your frontend application.
