// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import FadeInSection from "../utils/Fade";

// export default function Doctors() {
//   const navigate = useNavigate();
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filter, setFilter] = useState("");
//   const [selectedSpecialization, setSelectedSpecialization] = useState("");

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoading(true);
//         let url = "http://localhost:5000/api/doctors";
//         const params = new URLSearchParams();

//         if (selectedSpecialization) {
//           params.append("specialization", selectedSpecialization);
//         }

//         if (params.toString()) {
//           url += `?${params.toString()}`;
//         }

//         const response = await axios.get(url);
//         setDoctors(response.data);
//       } catch (err) {
//         console.error("Error fetching doctors:", err);
//         setError("Failed to load doctors");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDoctors();
//   }, [selectedSpecialization]);

//   const filteredDoctors = doctors.filter(
//     (doctor) =>
//       doctor.name.toLowerCase().includes(filter.toLowerCase()) ||
//       doctor.specialization.toLowerCase().includes(filter.toLowerCase())
//   );

//   const specializations = [
//     ...new Set(doctors.map((doctor) => doctor.specialization)),
//   ];

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

//   return (
//     <FadeInSection>
//       <div className="p-4 sm:p-6 mt-8 sm:mt-16 w-full">
//         {/* ------- Top Section ------- */}
//         <div className="bg-cyan-500 w-full p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6 h-auto sm:h-72">
//           <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2">
//             <div>
//               <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">Doctors</h1>
//               <p className="text-gray-600 text-sm sm:text-base">
//                 Browse and manage doctor profiles
//               </p>
//             </div>
//             <button
//               className="bg-cyan-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
//               onClick={() => navigate("/add-doctor")}
//             >
//               Add Doctor
//             </button>
//           </div>

//           {/* Filters */}
//           <div className="bg-cyan-500 rounded-lg shadow-md p-4 sm:p-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Search Doctors
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search by name or specialization..."
//                   value={filter}
//                   onChange={(e) => setFilter(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
//                 />
//               </div>
//               <div className="md:w-64">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Specialization
//                 </label>
//                 <select
//                   value={selectedSpecialization}
//                   onChange={(e) => setSelectedSpecialization(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
//                 >
//                   <option value="">All Specializations</option>
//                   {specializations.map((spec) => (
//                     <option key={spec} value={spec}>
//                       {spec}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ------- Doctors Grid ------- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//           {filteredDoctors.map((doctor) => (
//             <div
//               key={doctor._id}
//               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
//             >
//               <div className="p-4 sm:p-6">
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 sm:w-16 h-12 sm:h-16 bg-cyan-100 rounded-full flex items-center justify-center">
//                     {doctor.image ? (
//                       <img
//                         src={doctor.image}
//                           alt={doctor.name}
//                           className="w-12 sm:w-16 h-12 sm:h-16 rounded-full object-cover"
//                         />
//                     ) : (
//                       <svg
//                         className="w-8 h-8 text-cyan-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                       {doctor.name}
//                     </h3>
//                     <p className="text-cyan-600 font-medium text-sm sm:text-base">
//                       {doctor.specialization}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center text-xs sm:text-sm text-gray-600">
//                     <svg
//                       className="w-4 h-4 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                       />
//                     </svg>
//                     {doctor.email}
//                   </div>
//                   {doctor.phone && (
//                     <div className="flex items-center text-xs sm:text-sm text-gray-600">
//                       <svg
//                         className="w-4 h-4 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                         />
//                       </svg>
//                       {doctor.phone}
//                     </div>
//                   )}
//                   <div className="flex items-center text-xs sm:text-sm text-gray-600">
//                     <svg
//                       className="w-4 h-4 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     {doctor.experience} years experience
//                   </div>
//                   {doctor.consultation_fee && (
//                     <div className="flex items-center text-xs sm:text-sm text-gray-600">
//                       <svg
//                         className="w-4 h-4 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
//                         />
//                       </svg>
//                       ₹{doctor.consultation_fee} consultation fee
//                     </div>
//                   )}
//                 </div>
//                 {doctor.bio && (
//                   <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-3">
//                     {doctor.bio}
//                   </p>
//                 )}

//                 <div className="flex items-center justify-between">
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       doctor.is_active
//                         ? "bg-green-100 text-green-800"
//                         : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {doctor.is_active ? "Active" : "Inactive"}
//                   </span>
//                   <button className="text-cyan-600 hover:text-cyan-800 text-xs sm:text-sm font-medium">
//                     View Profile
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredDoctors.length === 0 && (
//           <div className="text-center py-8 sm:py-12">
//             <svg
//               className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//               />
//             </svg>
//             <h3 className="mt-2 text-sm font-medium text-gray-900">
//               No doctors found
//             </h3>
//             <p className="mt-1 text-sm text-gray-500">
//               {filter || selectedSpecialization
//                 ? "Try adjusting your search criteria."
//                 : "No doctors are currently available."}
//             </p>
//           </div>
//         )}
//       </div>
//     </FadeInSection>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FadeInSection from "../utils/Fade";

export default function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/doctors";
        const params = new URLSearchParams();

        if (selectedSpecialization) {
          params.append("specialization", selectedSpecialization);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await axios.get(url);
        setDoctors(response.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialization]);

  // Delete doctor function
  const handleDeleteDoctor = async (doctorId, doctorName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Dr. ${doctorName}? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return; // User cancelled, do nothing
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove doctor from state after successful deletion
      setDoctors(doctors.filter(doctor => doctor._id !== doctorId));
      
      console.log("Doctor deleted successfully");
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError("Failed to delete doctor");
      // You could show a toast notification here
      alert("Failed to delete doctor. Please try again.");
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(filter.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(filter.toLowerCase())
  );

  const specializations = [
    ...new Set(doctors.map((doctor) => doctor.specialization)),
  ];

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

  return (
    <FadeInSection>
      <div className="p-4 sm:p-6 mt-8 sm:mt-16 w-full">
        {/* ------- Top Section ------- */}
        <div className="bg-cyan-500 w-full p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6 h-auto sm:h-72">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">Doctors</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Browse and manage doctor profiles
              </p>
            </div>
            <button
              className="bg-cyan-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
              onClick={() => navigate("/add-doctor")}
            >
              Add Doctor
            </button>
          </div>

          {/* Filters */}
          <div className="bg-cyan-500 rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Doctors
                </label>
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
              </div>
              <div className="md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ------- Doctors Grid ------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-12 sm:w-16 h-12 sm:h-16 rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-8 h-8 text-cyan-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-cyan-600 font-medium text-sm sm:text-base">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {doctor.email}
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {doctor.phone}
                    </div>
                  )}
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {doctor.experience} years experience
                  </div>
                  {doctor.consultation_fee && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      ₹{doctor.consultation_fee} consultation fee
                    </div>
                  )}
                </div>
                {doctor.bio && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-3">
                    {doctor.bio}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doctor.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {doctor.is_active ? "Active" : "Inactive"}
                  </span>
                  <button 
                    onClick={() => handleDeleteDoctor(doctor._id, doctor.name)}
                  className="bg-red-50 text-red-700 px-2 sm:px-3 py-1 rounded-lg hover:bg-red-100 text-xs font-semibold border border-red-200 transition ml-2 sm:ml-4"
                  >
                    {/* <svg 
                      className="w-3 h-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg> */}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <svg
              className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No doctors found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter || selectedSpecialization
                ? "Try adjusting your search criteria."
                : "No doctors are currently available."}
            </p>
          </div>
        )}
      </div>
    </FadeInSection>
  );
}
