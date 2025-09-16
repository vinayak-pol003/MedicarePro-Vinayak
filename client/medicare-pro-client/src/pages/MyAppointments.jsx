// import { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import API from "../utils/api";
// import { AuthContext } from "../contex/AuthContext.jsx";
// import FadeInSection from "../utils/Fade.jsx";

// // Star rating rendering
// const RatingStars = ({ rating = 0 }) => (
//   <span>
//     {[1, 2, 3, 4, 5].map((i) => (
//       <span
//         key={i}
//         style={{
//           color: i <= rating ? "#facc15" : "#d1c9e6",
//           fontSize: "1.15em",
//           marginRight: "1px",
//         }}
//       >
//         ★
//       </span>
//     ))}
//   </span>
// );

// function formatTimeToIST(timeStr) {
//   if (!timeStr) return "";
//   const [h, m] = timeStr.split(":");
//   let hour = parseInt(h, 10);
//   let ampm = "AM";
//   if (hour >= 12) {
//     ampm = "PM";
//     if (hour > 12) hour -= 12;
//   } else if (hour === 0) {
//     hour = 12;
//   }
//   return `${hour}:${m} ${ampm} IST`;
// }

// function shortDate(dateStr) {
//   if (!dateStr) return "";
//   const datePart = dateStr.split("T")[0];
//   return datePart;
// }

// // Doctor Info Modal Component with loading/error
// function DoctorInfoModal({ doctor, loading, error, onClose }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
//       <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl relative">
//         <button
//           className="absolute top-2 right-3 text-lg text-gray-600"
//           onClick={onClose}
//         >
//           ×
//         </button>
//         {loading ? (
//           <div className="text-center py-10">Loading doctor details...</div>
//         ) : error ? (
//           <div className="text-center py-10 text-red-600">{error}</div>
//         ) : doctor ? (
//           <div className="mt-2">
//             <img
//               src={doctor.image || "/placeholder-doctor.png"}
//               className="w-24 h-24 rounded-full mx-auto mb-3"
//               alt={doctor.name}
//             />
//             <h2 className="text-xl font-bold mb-1 text-cyan-700">{doctor.name}</h2>
//             <p className="font-medium text-gray-700 mb-2">{doctor.specialization}</p>
//             <p className="text-sm text-gray-600 mb-2">{doctor.bio}</p>
//             <div className="my-2">
//               <p>Experience: {doctor.experience} years</p>
//               <p>Qualification: {doctor.qualification}</p>
//               <p>Email: {doctor.email}</p>
//               <p>Phone: {doctor.phone}</p>
//               <p>Consultation Fee: ₹{doctor.consultation_fee}</p>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-10 text-gray-500">No doctor information available.</div>
//         )}
//       </div>
//     </div>
//   );
// }

// const MyAppointments = () => {
//   const { user } = useContext(AuthContext);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filter, setFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [showDoctorModal, setShowDoctorModal] = useState(false);
//   const [doctorLoading, setDoctorLoading] = useState(false);
//   const [doctorError, setDoctorError] = useState("");

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await API.get("/appointments/my", {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         });
//         setAppointments(res.data);
//       } catch (err) {
//         setError("Failed to load your appointments");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAppointments();
//   }, []);

//   // Fetch doctor info by backend API when clicked
//   const fetchDoctorDetail = async (doctorId) => {
//     try {
//       setDoctorLoading(true);
//       setDoctorError("");
//       setSelectedDoctor(null);
//       setShowDoctorModal(true);
//       const res = await API.get(`/doctors/${doctorId}`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
//       setSelectedDoctor(res.data);
//     } catch (err) {
//       setDoctorError("Error loading doctor details.");
//     } finally {
//       setDoctorLoading(false);
//     }
//   };

//   const filteredAppointments = appointments.filter((apt) => {
//     const doctor = apt.doctor_id?.name?.toLowerCase() || "";
//     const specialization = apt.doctor_id?.specialization?.toLowerCase() || "";
//     const patient = apt.patient_id?.name?.toLowerCase() || "";
//     const matchesSearch =
//       doctor.includes(filter.toLowerCase()) ||
//       specialization.includes(filter.toLowerCase()) ||
//       patient.includes(filter.toLowerCase());
//     const matchesStatus =
//       !statusFilter || apt.status.toLowerCase() === statusFilter.toLowerCase();
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <FadeInSection>
//       <div className="p-4 sm:p-6 mt-14 sm:mt-16 w-full">
//         <div className="bg-cyan-500 w-full p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
//           <div className="mb-4 sm:mb-8 bg-cyan-500">
//             <div className="flex flex-col sm:flex-row justify-between items-center">
//               <div>
//                 <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Appointments</h1>
//                 <p className="text-gray-600 text-sm sm:text-base">
//                   Manage and track all appointments
//                 </p>
//               </div>
//             </div>
//           </div>
//           {/* Filters */}
//           <div className="bg-cyan-500 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Search Appointments
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search by doctor, patient, or specialization..."
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

//         <div className="w-full bg-white rounded-2xl shadow-xl overflow-x-auto">
//           <h1 className="text-lg sm:text-2xl font-bold px-4 sm:px-8 pt-4 sm:pt-8 pb-2 sm:pb-4 text-cyan-500">
//             My Appointments
//           </h1>
//           {loading ? (
//             <div className="flex items-center justify-center h-48 sm:h-64">
//               <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-cyan-600"></div>
//             </div>
//           ) : error ? (
//             <div className="p-4 sm:p-8">
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                 {error}
//               </div>
//             </div>
//           ) : filteredAppointments.length === 0 ? (
//             <div className="px-4 sm:px-8 pb-4 sm:pb-8 text-gray-500">
//               You have no appointments scheduled.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-left">
//                 <thead>
//                   <tr className="bg-[#f7f7fb]">
//                     <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Date</th>
//                     <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Time (IST)</th>
//                     <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Doctor</th>
//                     <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Specialization</th>
//                     <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Status</th>
//                     <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Rating</th>
//                     <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Prescription</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredAppointments.map((apt, idx) => (
//                     <tr
//                       key={apt._id}
//                       className={idx % 2 === 1 ? "bg-cyan-50" : ""}
//                     >
//                       <td className="py-2 sm:py-4 px-2 sm:px-6">{shortDate(apt.date)}</td>
//                       <td className="py-2 sm:py-4 px-2 sm:px-6">{formatTimeToIST(apt.time)}</td>
//                       <td className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">
//                         <span
//                           className="text-cyan-600 hover:underline cursor-pointer"
//                           onClick={() =>
//                             fetchDoctorDetail(
//                               apt.doctor_id?._id || apt.doctor_id
//                             )
//                           }
//                         >
//                           {apt.doctor_id?.name || "Unknown"}
//                         </span>
//                       </td>
//                       <td className="py-2 sm:py-4 px-2 sm:px-6">
//                         {apt.doctor_id?.specialization || ""}
//                       </td>
//                       <td className="py-2 sm:py-4 px-2 sm:px-6 capitalize">{apt.status}</td>
//                       <td className="py-2 sm:py-4 px-2 sm:px-6">
//                         <RatingStars rating={apt.rating || 0} />
//                       </td>
//                       <td className="py-2 sm:py-4 px-2 sm:px-6">
//                         {apt.prescription &&
//                         apt.prescription !== "null" &&
//                         apt.prescription !== null &&
//                         apt.prescription !== undefined ? (
//                           <Link
//                             to={`/myprescription/${apt._id}`}
//                             className="text-cyan-600 hover:underline"
//                           >
//                             View
//                           </Link>
//                         ) : (
//                           <span className="text-gray-500">Not added</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="py-2 sm:py-4"></div>
//             </div>
//           )}
//         </div>
//         {showDoctorModal && (
//           <DoctorInfoModal
//             doctor={selectedDoctor}
//             loading={doctorLoading}
//             error={doctorError}
//             onClose={() => {
//               setShowDoctorModal(false);
//               setSelectedDoctor(null);
//               setDoctorError("");
//             }}
//           />
//         )}
//       </div>
//     </FadeInSection>
//   );
// };

// export default MyAppointments;


import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade.jsx";


// Star rating rendering
const RatingStars = ({ rating = 0 }) => (
  <span>
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        style={{
          color: i <= rating ? "#facc15" : "#d1c9e6",
          fontSize: "1.15em",
          marginRight: "1px",
        }}
      >
        ★
      </span>
    ))}
  </span>
);

function formatTimeToIST(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  let hour = parseInt(h, 10);
  let ampm = "AM";
  if (hour >= 12) {
    ampm = "PM";
    if (hour > 12) hour -= 12;
  } else if (hour === 0) {
    hour = 12;
  }
  return `${hour}:${m} ${ampm} IST`;
}

function shortDate(dateStr) {
  if (!dateStr) return "";
  const datePart = dateStr.split("T")[0];
  return datePart;
}

// Inline Doctor Details Component
function DoctorDetailsCard({ doctor, loading, error, onClose }) {
  return (
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6 m-4 rounded-lg shadow-lg animate-fadeIn">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-cyan-700 flex items-center">
          <span className="mr-2">👨‍⚕️</span>
          Doctor Details
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-cyan-200 border-t-cyan-600"></div>
          <span className="ml-3 text-gray-600">Loading doctor details...</span>
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      ) : doctor ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Doctor Image */}
          <div className="text-center">
            <img
              src={doctor.image || "/placeholder-doctor.png"}
              className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-white shadow-lg"
              alt={doctor.name}
            />
            <h4 className="font-bold text-lg text-gray-800">{doctor.name}</h4>
            <p className="text-cyan-600 font-medium">{doctor.specialization}</p>
          </div>
          
          {/* Doctor Information */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-3">Professional Information</h5>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Experience:</span>
                  <span className="ml-2 text-gray-800">{doctor.experience} years</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Qualification:</span>
                  <span className="ml-2 text-gray-800">{doctor.qualification}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-800">{doctor.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span className="ml-2 text-gray-800">{doctor.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-medium text-gray-600">Consultation Fee:</span>
                  <span className="ml-2 text-green-600 font-semibold">₹{doctor.consultation_fee}</span>
                </div>
              </div>
              
              {doctor.bio && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h6 className="font-medium text-gray-600 mb-2">About</h6>
                  <p className="text-gray-700 text-sm leading-relaxed">{doctor.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No doctor information available.
        </div>
      )}
    </div>
  );
}

const MyAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null); // Track which row is expanded
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorError, setDoctorError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("/appointments/my", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setAppointments(res.data);
      } catch (err) {
        setError("Failed to load your appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Fetch doctor info and toggle expanded row
  const fetchDoctorDetail = async (doctorId, appointmentId) => {
    try {
      // If clicking the same doctor, just toggle
      if (expandedRow === appointmentId) {
        setExpandedRow(null);
        setSelectedDoctor(null);
        return;
      }

      setDoctorLoading(true);
      setDoctorError("");
      setSelectedDoctor(null);
      setExpandedRow(appointmentId);

      const res = await API.get(`/doctors/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSelectedDoctor(res.data);
    } catch (err) {
      setDoctorError("Error loading doctor details.");
    } finally {
      setDoctorLoading(false);
    }
  };

  const closeDoctorDetails = () => {
    setExpandedRow(null);
    setSelectedDoctor(null);
    setDoctorError("");
  };

  const filteredAppointments = appointments.filter((apt) => {
    const doctor = apt.doctor_id?.name?.toLowerCase() || "";
    const specialization = apt.doctor_id?.specialization?.toLowerCase() || "";
    const patient = apt.patient_id?.name?.toLowerCase() || "";
    const matchesSearch =
      doctor.includes(filter.toLowerCase()) ||
      specialization.includes(filter.toLowerCase()) ||
      patient.includes(filter.toLowerCase());
    const matchesStatus =
      !statusFilter || apt.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <FadeInSection>
      <div className="p-4 sm:p-6 mt-14 sm:mt-16 w-full">
        <div className="bg-cyan-500 w-full p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-8 bg-cyan-500">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                  Appointments
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage and track all appointments
                </p>
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="bg-cyan-500 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Appointments
                </label>
                <input
                  type="text"
                  placeholder="Search by doctor, patient, or specialization..."
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

        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <h1 className="text-lg sm:text-2xl font-bold px-4 sm:px-8 pt-4 sm:pt-8 pb-2 sm:pb-4 text-cyan-500">
            My Appointments
          </h1>
          {loading ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-cyan-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 sm:p-8">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="px-4 sm:px-8 pb-4 sm:pb-8 text-gray-500">
              You have no appointments scheduled.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-[#f7f7fb]">
                    <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Date</th>
                    <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Time (IST)</th>
                    <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Doctor</th>
                    <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Specialization</th>
                    <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Status</th>
                    <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Rating</th>
                    <th className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt, idx) => (
                    <React.Fragment key={apt._id}>
                      <tr
                        className={idx % 2 === 1 ? "bg-cyan-50" : ""}
                      >
                        <td className="py-2 sm:py-4 px-2 sm:px-6">{shortDate(apt.date)}</td>
                        <td className="py-2 sm:py-4 px-2 sm:px-6">{formatTimeToIST(apt.time)}</td>
                        <td className="py-2 sm:py-4 px-2 sm:px-6 font-semibold">
                          <span
                            className="text-cyan-600 hover:underline cursor-pointer hover:bg-cyan-100 px-2 py-1 rounded transition-colors"
                            onClick={() =>
                              fetchDoctorDetail(
                                apt.doctor_id?._id || apt.doctor_id,
                                apt._id
                              )
                            }
                          >
                            {apt.doctor_id?.name || "Unknown"}
                            {expandedRow === apt._id && (
                              <span className="ml-2 text-xs">▼</span>
                            )}
                          </span>
                        </td>
                        <td className="py-2 sm:py-4 px-2 sm:px-6">
                          {apt.doctor_id?.specialization || ""}
                        </td>
                        <td className="py-2 sm:py-4 px-2 sm:px-6 capitalize">{apt.status}</td>
                        <td className="py-2 sm:py-4 px-2 sm:px-6">
                          <RatingStars rating={apt.rating || 0} />
                        </td>
                        <td className="py-2 sm:py-4 px-2 sm:px-6">
                          {apt.prescription &&
                          apt.prescription !== "null" &&
                          apt.prescription !== null &&
                          apt.prescription !== undefined ? (
                            <Link
                              to={`/myprescription/${apt._id}`}
                              className="text-cyan-600 hover:underline"
                            >
                              View
                            </Link>
                          ) : (
                            <span className="text-gray-500">Not added</span>
                          )}
                        </td>
                      </tr>
                      {/* Expanded Doctor Details Row */}
                      {expandedRow === apt._id && (
                        <tr>
                          <td colSpan="7" className="p-0 bg-gray-50">
                            <DoctorDetailsCard
                              doctor={selectedDoctor}
                              loading={doctorLoading}
                              error={doctorError}
                              onClose={closeDoctorDetails}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="py-2 sm:py-4"></div>
            </div>
          )}
        </div>
      </div>
    </FadeInSection>
  );
};

export default MyAppointments;
