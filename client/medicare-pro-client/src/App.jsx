import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
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
import AdminContact from './components/AdminContact.jsx';
import DoctorsDashboard from './pages/DoctorsDashboard.jsx';
import BookAppointment from "./pages/BookAppointment.jsx";
import PatientsForm from "./pages/PatientsForm.jsx";
import Requests from "./components/Requests.jsx";
import PatientsDashboard from "./pages/PatientDashboard.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        
        {/* Toast Notifications Container */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '400px',
            },
            // Success toast styling
            success: {
              style: {
                background: '#f0f9ff',
                color: '#0c4a6e',
                border: '1px solid #0ea5e9',
              },
              iconTheme: {
                primary: '#0ea5e9',
                secondary: '#f0f9ff',
              },
              duration: 1000,
            },
            // Error toast styling
            error: {
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #ef4444',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fef2f2',
              },
              duration: 1000,
            },
            // Loading toast styling
            loading: {
              style: {
                background: '#fffbeb',
                color: '#92400e',
                border: '1px solid #f59e0b',
              },
              iconTheme: {
                primary: '#f59e0b',
                secondary: '#fffbeb',
              },
            },
          }}
        />

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
          <Route path="/chat" element={<ChatWithGemini/>}/>
          <Route path="/admin/contacts" element={<AdminContact />} />
          <Route path="/doctors-dashboard" element={<DoctorsDashboard/>} />
          <Route path="/book-appointment" element={<RoleProtectedRoute allowedRoles={['patient']}> <BookAppointment/> </RoleProtectedRoute>} />
          <Route path="/patients-form" element={<PatientsForm/>}/>
          <Route path="/patient-request" element={<Requests/>}/>
          <Route path="/patients-dashboard" element={<PatientsDashboard />} />
          <Route path="*" element={<h1 className="text-3xl font-bold text-center mt-20">404 - Page Not Found</h1>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}