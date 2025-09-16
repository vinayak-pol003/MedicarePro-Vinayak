import { useState, useEffect, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade.jsx";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todaysAppointments: 0,
    totalAdmins: 0, // Add totalAdmins to stats
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Max values for bar-filling (tune to your real upper-range for each metric)
  const MAX = {
    doctors: 20,
    patients: 100,
    appointments: 200,
    todaysAppointments: 40,
    admins: 10, // Add max value for admins
  };

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "doctor")) {
      setError("Dashboard stats are only available to admins and doctors.");
      setLoading(false);
      return;
    }
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError("");
        const [doctorsRes, patientsRes, appointmentsRes, todaysAppointmentsRes, usersRes] = await Promise.all([
          API.get("/doctors"),
          API.get("/patients"),
          API.get("/appointments"),
          API.get("/appointments/today"),
          API.get("/users"), // Fetch all users to filter admins
        ]);

        // Filter admin users from all users
        const adminUsers = Array.isArray(usersRes.data) 
          ? usersRes.data.filter(user => user.role === "admin") 
          : [];

        setStats({
          totalDoctors: Array.isArray(doctorsRes.data) ? doctorsRes.data.length : 0,
          totalPatients: Array.isArray(patientsRes.data) ? patientsRes.data.length : 0,
          totalAppointments: Array.isArray(appointmentsRes.data) ? appointmentsRes.data.length : 0,
          todaysAppointments: Array.isArray(todaysAppointmentsRes.data) ? todaysAppointmentsRes.data.length : 0,
          totalAdmins: adminUsers.length, // Count of admin users
        });
      } catch (err) {
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, [user]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 mt-8 sm:mt-16 flex items-center justify-center h-48 sm:h-64">
        <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-cyan-600"></div>
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
      <div className="bg-[#f7fafc] w-full min-h-screen p-4 sm:p-8 mt-13">
        <div className="bg-cyan-500 w-full p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Overview of system metrics and management tools
              </p>
            </div>

            {/* show button only for admins */}
            {user?.role === "admin" && (
              <button className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700">
                <Link to="/add-admin">Add Admin</Link>
              </button>
            )}
          </div>
        </div>

        {/* Top stat cards - Updated to include Admins */}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
           {/* New Admins Card */}
          <div className="rounded-xl bg-[#f0f4ff] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Admins</span>
            <span className="text-3xl font-bold text-gray-800">{stats.totalAdmins}</span>
            <span className="text-green-500 font-medium text-xs mt-2">+0.5% ↗</span>
          </div>
          <div className="rounded-xl bg-[#e6f3ff] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Doctors</span>
            <span className="text-3xl font-bold text-gray-800">{stats.totalDoctors}</span>
            <span className="text-green-500 font-medium text-xs mt-2">+1.0% ↗</span>
          </div>
          <div className="rounded-xl bg-[#e5f8f8] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Patients</span>
            <span className="text-3xl font-bold text-gray-800">{stats.totalPatients}</span>
            <span className="text-green-500 font-medium text-xs mt-2">2.5%</span>
          </div>
         
          <div className="rounded-xl bg-[#edf5ff] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Appointments</span>
            <span className="text-3xl font-bold text-gray-800">{stats.totalAppointments}</span>
            <span className="text-green-500 font-medium text-xs mt-2">+0.7% ↗</span>
          </div>
          <div className="rounded-xl bg-[#eef6fc] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Today's Appointments</span>
            <span className="text-3xl font-bold text-gray-800">{stats.todaysAppointments}</span>
            <span className="text-green-500 font-medium text-xs mt-2">+0.2% ↗</span>
          </div>
        </div>

        {/* Medicare Analytics Section - Updated to include Admins */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 w-full">
          {/* Total Beneficiaries Dynamic Bar Chart */}
          <div className="col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col min-h-[250px]">
            <div className="flex items-center gap-4 mb-3">
              <div className="text-gray-900 font-bold text-lg">Total Beneficiaries</div>
              <div className="flex gap-4 text-xs">
                <div className="text-cyan-700 font-medium">Current Stats</div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-4 mt-6 mb-3">
              {/* Doctors */}
              <div className="flex items-center">
                <span className="w-28 text-sm text-gray-500">Doctors</span>
                <div className="flex-1 h-7 mx-2 relative rounded-full bg-cyan-100 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((stats.totalDoctors / MAX.doctors) * 100, 100)}%` }}
                  ></div>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-700 font-semibold">{stats.totalDoctors}</span>
                </div>
              </div>
              {/* Patients */}
              <div className="flex items-center">
                <span className="w-28 text-sm text-gray-500">Patients</span>
                <div className="flex-1 h-7 mx-2 relative rounded-full bg-indigo-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((stats.totalPatients / MAX.patients) * 100, 100)}%` }}
                  ></div>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-700 font-semibold">{stats.totalPatients}</span>
                </div>
              </div>
              {/* Admins - New Bar */}
              <div className="flex items-center">
                <span className="w-28 text-sm text-gray-500">Admins</span>
                <div className="flex-1 h-7 mx-2 relative rounded-full bg-purple-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((stats.totalAdmins / MAX.admins) * 100, 100)}%` }}
                  ></div>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-700 font-semibold">{stats.totalAdmins}</span>
                </div>
              </div>
              {/* Appointments */}
              <div className="flex items-center">
                <span className="w-28 text-sm text-gray-500">Appointments</span>
                <div className="flex-1 h-7 mx-2 relative rounded-full bg-teal-100 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((stats.totalAppointments / MAX.appointments) * 100, 100)}%` }}
                  ></div>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-700 font-semibold">{stats.totalAppointments}</span>
                </div>
              </div>
              {/* Today's Appointments */}
              <div className="flex items-center">
                <span className="w-28 text-sm text-gray-500">Today</span>
                <div className="flex-1 h-7 mx-2 relative rounded-full bg-amber-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((stats.todaysAppointments / MAX.todaysAppointments) * 100, 100)}%` }}
                  ></div>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-700 font-semibold">{stats.todaysAppointments}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center opacity-40">
              <div className="w-full h-8 bg-gradient-to-tr from-cyan-100 via-cyan-200 to-cyan-100 rounded-xl"></div>
            </div>
          </div>
          {/* Bookings by Source - placeholder */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col min-h-[250px]">
            <div className="text-gray-900 font-bold mb-4">Bookings by Source</div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex justify-between">Google <span>20.7%</span></li>
              <li className="flex justify-between">YouTube <span>40.8%</span></li>
              <li className="flex justify-between">Instagram <span>50.2%</span></li>
              <li className="flex justify-between">Pinterest <span>10%</span></li>
              <li className="flex justify-between">Facebook <span>15.5%</span></li>
              <li className="flex justify-between">Twitter <span>5.5%</span> </li>
            </ul>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}

