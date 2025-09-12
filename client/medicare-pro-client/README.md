Medicare Pro Frontend
This document outlines the frontend part of the Medicare Pro hospital management system. Built as a single-page application with React and styled using Tailwind CSS, it provides a modern, responsive interface for all roles—Admin, Doctor, Patient, Receptionist. The frontend interacts seamlessly with the backend API and supports cloud-based image uploads via ImageKit.

--------------------------------------------------------------------------------------------------------------------------------------------

💻 Technologies Used
React (Vite): Fast SPA development

Tailwind CSS: Utility-first styling for custom designs

Axios: HTTP requests to backend APIs

ImageKit JS SDK: For uploading and serving patient/doctor profile images securely via CDN

--------------------------------------------------------------------------------------------------------------------------------------------


✨ Key Features
Authentication & Roles:

Secure JWT-based login/logout

Role-based navigation/dashboard views (Admin, Doctor, Patient, Receptionist)

Patient Dashboard:

View upcoming appointments and medical records (prescriptions)

Patient profile images stored/retrieved instantly from ImageKit CDN

Appointment Management:

Schedule/view appointments with status (Scheduled, Completed, Cancelled)

Doctor's Interface:

Dashboard for upcoming appointments

Add prescriptions for patient appointments

Doctor profile images uploaded to, and served from, ImageKit cloud

Chat with AI:

"Chat with AI" page using Gemini API for interactive health guidance

Responsive UI:

Entire app is mobile- and desktop-friendly, with dynamic loading/error states

Cloud Image Storage:

ImageKit integration enables instant, secure profile photo uploads—no local file storage required

--------------------------------------------------------------------------------------------------------------------------------------------

🗺️ Hospital Location
You can find the location of our hospital here:

xml
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.253046772744!2d-73.98785468459424!3d40.74844037932795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2596d11e86053%3A0x600b21a8141f173b!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1628167819890!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>


--------------------------------------------------------------------------------------------------------------------------------------------
⚙️ Installation and Setup
Navigate to the client folder:

bash
cd medicare-pro/client
Install dependencies:

bash
npm install
Run the development server:

bash
npm run dev
Your local app runs on http://localhost:5173.

--------------------------------------------------------------------------------------------------------------------------------------------

🚀 Deployment
Frontend can be deployed via Vercel (recommended).

Push the client folder to GitHub.

Connect your repo to Vercel.

Update API Base URL:

Open client/src/utils/api.js

Change the Axios baseURL to your deployed backend:

js
import axios from "axios";
export default axios.create({
  baseURL: "https://your-backend-url.com/api",
});
ImageKit:

Ensure your ImageKit config (client/src/utils/ImageKit.js) uses your production credentials and endpoint.

All image uploads happen on the client; CDN URLs are sent to backend.

Deploy the project.

Vercel gives you a public frontend URL.