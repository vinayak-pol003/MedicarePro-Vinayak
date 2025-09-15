// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../contex/AuthContext.jsx";
// import AddAppointment from "./AddAppointment.jsx";
// import { Link, useNavigate } from "react-router-dom";
// import FadeInSection from "../utils/Fade.jsx";

// export default function Appointments() {
//   const { user } = useContext(AuthContext);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filter, setFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [patients, setPatients] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [formData, setFormData] = useState({
//     patient_id: "",
//     doctor_id: "",
//     date: "",
//     time: "",
//     status: "scheduled"
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
//         const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/appointments", { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get("http://localhost:5000/api/patients", { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get("http://localhost:5000/api/doctors")
//         ]);
//         setAppointments(appointmentsRes.data);
//         setPatients(patientsRes.data);
//         setDoctors(doctorsRes.data);
//       } catch (err) {
//         console.error("Error fetching appointments:", err);
//         setError("Failed to load appointments");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const filteredAppointments = appointments.filter(appointment => {
//     const patientName = appointment.patient_id?.name?.toLowerCase() || "";
//     const doctorName = appointment.doctor_id?.name?.toLowerCase() || "";
//     const matchesSearch = patientName.includes(filter.toLowerCase()) || doctorName.includes(filter.toLowerCase());
//     const matchesStatus = !statusFilter || appointment.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post("http://localhost:5000/api/appointments", formData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const response = await axios.get("http://localhost:5000/api/appointments", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setAppointments(response.data);
//       setFormData({ patient_id: "", doctor_id: "", date: "", time: "", status: "scheduled" });
//       setShowAddForm(false);
//       setError("");
//     } catch (err) {
//       console.error("Error creating appointment:", err);
//       setError("Failed to create appointment");
//     }
//   };

//   const updateAppointmentStatus = async (id, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:5000/api/appointments/${id}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` }
//       });
//       const response = await axios.get("http://localhost:5000/api/appointments", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setAppointments(response.data);
//     } catch (err) {
//       console.error("Error updating appointment:", err);
//       setError("Failed to update appointment");
//     }
//   };

//   // NEW: Delete handler
//   const handleDeleteAppointment = async (id, e) => {
//     e.stopPropagation();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       // Refresh after delete
//       const response = await axios.get("http://localhost:5000/api/appointments", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setAppointments(response.data);
//       setError("");
//     } catch (err) {
//       console.error("Error deleting appointment:", err);
//       setError("Failed to delete appointment");
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'scheduled': return 'bg-blue-100 text-blue-800';
//       case 'completed': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-4 sm:p-6 mt-8 sm:mt-16">
//         <div className="flex items-center justify-center h-48 sm:h-64">
//           <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-cyan-600"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 sm:p-6 mt-8 sm:mt-16">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   // Row click handler
//   const handleRowClick = (id) => {
//     navigate(`/doctorprescription/${id}`);
//   };

//   return (
//     <FadeInSection>
//       <div className="p-4 sm:p-6 mt-14 sm:mt-16 w-full">
//         <div className="bg-cyan-500 w-full p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
//           <div className="mb-4 sm:mb-8 bg-cyan-500">
//             <div className="flex flex-col sm:flex-row justify-between items-center">
//               <div>
//                 <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Appointments</h1>
//                 <p className="text-gray-600 text-sm sm:text-base">Manage and track all appointments</p>
//               </div>
//               {["patient", "doctor", "admin"].includes(user?.role) && (
//                 <button
//                   className="bg-cyan-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
//                 >
//                   <Link to='/addappointment'>Add Appointment</Link>
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="bg-cyan-500 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Search Appointments
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search by patient or doctor name..."
//                   value={filter}
//                   onChange={(e) => setFilter(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
//                 />
//               </div>
//               <div className="md:w-48">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="w-full px-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="scheduled">Scheduled</option>
//                   <option value="completed">Completed</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {showAddForm && (
//           <AddAppointment
//             onAdded={() => {
//               setShowAddForm(false);
//               fetchData();
//             }}
//             onCancel={() => setShowAddForm(false)}
//           />
//         )}

//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Patient
//                   </th>
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Doctor
//                   </th>
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date & Time
//                   </th>
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                   {/* NEW DELETE COLUMN */}
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Delete
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredAppointments.map((appointment) => (
//                   <tr
//                     key={appointment._id}
//                     className="hover:bg-gray-50 cursor-pointer"
//                     onClick={() => handleRowClick(appointment._id)}
//                   >
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {appointment.patient_id?.name || 'Unknown Patient'}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {appointment.patient_id?.email || ''}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {appointment.doctor_id?.name || 'Unknown Doctor'}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {appointment.doctor_id?.specialization || ''}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm text-gray-900">
//                           {new Date(appointment.date).toLocaleDateString()}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {appointment.time}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
//                         {appointment.status}
//                       </span>
//                     </td>
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={e => e.stopPropagation()}>
//                       <div className="flex space-x-2">
//                         {appointment.status === 'scheduled' && (
//                           <>
//                             <button
//                               onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
//                               className="text-green-600 hover:text-green-900"
//                             >
//                               Complete
//                             </button>
//                             <button
//                               onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
//                               className="text-red-600 hover:text-red-900"
//                             >
//                               Cancel
//                             </button>
//                           </>
//                         )}
//                         {appointment.status === 'completed' && (
//                           <button
//                             onClick={() => updateAppointmentStatus(appointment._id, 'scheduled')}
//                             className="text-blue-600 hover:text-blue-900"
//                           >
//                             Reschedule
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                     {/* NEW DELETE BUTTON COLUMN */}
//                     <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={e => e.stopPropagation()}>
//                       <button
//                         onClick={e => handleDeleteAppointment(appointment._id, e)}
//                         className="text-red-600 hover:text-red-900 bg-red-100 px-2 py-1 rounded transition-colors"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filteredAppointments.length === 0 && (
//             <div className="text-center py-8 sm:py-12">
//               <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {filter || statusFilter
//                   ? "Try adjusting your search criteria."
//                   : "No appointments are currently scheduled."}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </FadeInSection>
//   );
// }


import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contex/AuthContext.jsx";
import AddAppointment from "./AddAppointment.jsx";
import { Link, useNavigate } from "react-router-dom";
import FadeInSection from "../utils/Fade.jsx";

export default function Appointments() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    date: "",
    time: "",
    status: "scheduled"
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/appointments", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/patients", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/doctors")
        ]);
        setAppointments(appointmentsRes.data);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debug logging
  console.log("Current user:", user?._id, user?.role);
  appointments.forEach((apt, index) => {
    console.log(`Appointment ${index}:`, {
      appointmentId: apt._id,
      doctorId: apt.doctor_id,
      doctorIdObject: apt.doctor_id?._id,
      patientName: apt.patient_id?.name
    });
  });

  // Filter appointments for doctors to see only their own
 const visibleAppointments = user?.role === "doctor"
  ? appointments.filter(appointment => {
      return appointment.doctor_id?.email === user.email;
    })
  : appointments;



    // Add this right after const { user } = useContext(AuthContext);
console.log("Full user object from AuthContext:", user);
console.log("Available user keys:", user ? Object.keys(user) : "No user");


    

  const filteredAppointments = visibleAppointments.filter(appointment => {
    const patientName = appointment.patient_id?.name?.toLowerCase() || "";
    const doctorName = appointment.doctor_id?.name?.toLowerCase() || "";
    const matchesSearch = patientName.includes(filter.toLowerCase()) || doctorName.includes(filter.toLowerCase());
    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post("http://localhost:5000/api/appointments", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
      setFormData({ patient_id: "", doctor_id: "", date: "", time: "", status: "scheduled" });
      setShowAddForm(false);
      setError("");
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("Failed to create appointment");
    }
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/appointments/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError("Failed to update appointment");
    }
  };

  const handleDeleteAppointment = async (id, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
      setError("");
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Failed to delete appointment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 mt-8 sm:mt-16">
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 mt-8 sm:mt-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const handleRowClick = (id) => {
    navigate(`/doctorprescription/${id}`);
  };

  return (
    <FadeInSection>
      <div className="p-4 sm:p-6 mt-14 sm:mt-16 w-full">
        <div className="bg-cyan-500 w-full p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-8 bg-cyan-500">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Appointments</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage and track all appointments</p>
              </div>
              {["patient", "doctor", "admin"].includes(user?.role) && (
                <button
                  className="bg-cyan-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
                >
                  <Link to='/addappointment'>Add Appointment</Link>
                </button>
              )}
            </div>
          </div>
          <div className="bg-cyan-500 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Appointments
                </label>
                <input
                  type="text"
                  placeholder="Search by patient or doctor name..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>
              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {showAddForm && (
          <AddAppointment
            onAdded={() => {
              setShowAddForm(false);
              fetchData();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(appointment._id)}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patient_id?.name || 'Unknown Patient'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patient_id?.email || ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.doctor_id?.name || 'Unknown Doctor'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.doctor_id?.specialization || ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={e => e.stopPropagation()}>
                      <div className="flex space-x-2">
                        {appointment.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === 'completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'scheduled')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Reschedule
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={e => handleDeleteAppointment(appointment._id, e)}
                        className="bg-red-50 text-red-700 px-2 sm:px-3 py-1 rounded-lg hover:bg-red-100 text-xs font-semibold border border-red-200 transition ml-2 sm:ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter || statusFilter
                  ? "Try adjusting your search criteria."
                  : "No appointments are currently scheduled."}
              </p>
            </div>
          )}
        </div>
      </div>
    </FadeInSection>
  );
}
