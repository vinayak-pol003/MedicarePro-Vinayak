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
import Profile from "./pages/Profile.jsx";
import MyAppointments from './pages/MyAppointments.jsx';
import AddAppointment from "./pages/AddAppointment.jsx";
import DoctorPrescription from "./pages/DoctorPrescription.jsx";
import MyPrescription from "./pages/MyPrescription.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import AddDoctor from "./pages/AddDoctors.jsx";
import ChatWithGemini from "./pages/ChatWithGemini.jsx";
import PublicRoute from "./contex/PublicRoute.jsx";
import RoleProtectedRoute from "./contex/RoleProtectedRoute.jsx";
import AddAdmin from "./pages/AddAdmin.jsx";



export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<RoleProtectedRoute allowedRoles={['admin','doctor']}> <PrivateRoute><Dashboard /></PrivateRoute> </RoleProtectedRoute>} />
          <Route path="/patients" element={<RoleProtectedRoute allowedRoles={['admin','doctor']}> <PrivateRoute><Patients /></PrivateRoute></RoleProtectedRoute>} />
          <Route path="/appointments" element={<RoleProtectedRoute allowedRoles={['admin','doctor']}><PrivateRoute><Appointments /></PrivateRoute></RoleProtectedRoute>} />
          <Route path="/doctors" element={<RoleProtectedRoute allowedRoles={['admin','doctor']}> <PrivateRoute><Doctors /></PrivateRoute> </RoleProtectedRoute>} />
          <Route path="/signin" element={<PublicRoute> <SignIn />  </PublicRoute>} />
          <Route path="/signup" element={<PublicRoute> <SignUp />  </PublicRoute>} />
          <Route path="/addpatient" element={<RoleProtectedRoute allowedRoles={['admin','doctor']}>  <AddPatient/>  </RoleProtectedRoute>} />
          <Route path="/my-appointments" element={<RoleProtectedRoute allowedRoles={['patient']}>  <MyAppointments/>  </RoleProtectedRoute>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/addappointment" element={<RoleProtectedRoute allowedRoles={['admin','doctor']}><AddAppointment/>  </RoleProtectedRoute>} />
          <Route path="/doctorprescription/:id" element={<RoleProtectedRoute allowedRoles={['admin','doctor']}>  <DoctorPrescription/>  </RoleProtectedRoute>}/>
          <Route path="/myprescription/:id" element={<RoleProtectedRoute allowedRoles={['patient']}><MyPrescription/> </RoleProtectedRoute>}/>
          <Route path="/contactus" element={<ContactUs/>}/>
          <Route path="/aboutus" element={<AboutUs/>}/>
          <Route path="/add-doctor" element={<RoleProtectedRoute allowedRoles={['admin','doctor']}>  <AddDoctor/>  </RoleProtectedRoute>}/>
          <Route path="/add-admin" element={<RoleProtectedRoute allowedRoles={['admin']}>  <AddAdmin/> </RoleProtectedRoute>}/>
          <Route path="/chat" element={<ChatWithGemini/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
