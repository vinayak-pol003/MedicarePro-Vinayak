import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import Landing from "./pages/Landing";
import { AuthProvider } from "./contex/AuthContext.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AddPatient from "./pages/AddPatients.jsx";
import Admin from "./components/Admin.jsx";
import Profile from "./pages/Profile.jsx";
import MyAppointments from './pages/MyAppointments.jsx';
import AddAppointment from "./pages/AddAppointment.jsx";
import DoctorPrescription from "./pages/DoctorPrescription.jsx";
import MyPrescription from "./pages/MyPrescription.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import AddDoctor from "./pages/AddDoctors.jsx";


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/patients" element={<PrivateRoute><Patients /></PrivateRoute>} />
          <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
          <Route path="/doctors" element={<PrivateRoute><Doctors /></PrivateRoute>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/addpatient" element={<AddPatient />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/my-appointments" element={<MyAppointments/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/addappointment" element={<AddAppointment/>} />
          <Route path="/doctorprescription/:id" element={<DoctorPrescription/>}/>
          <Route path="/myprescription/:id" element={<MyPrescription/>}/>
          <Route path="/contactus" element={<ContactUs/>}/>
          <Route path="/aboutus" element={<AboutUs/>}/>
          <Route path="/add-doctor" element={<AddDoctor/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
