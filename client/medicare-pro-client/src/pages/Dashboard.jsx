import { useState, useEffect, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../contex/AuthContext.jsx";

// Utility function to get today's date in YYYY-MM-DD format
function getTodayString() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todaysAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only allow admin to view dashboard summary
    if (!user || (user.role !== "admin" && user.role !== "doctor")) {
      setError("Dashboard stats are only available to admins and doctors.");
      setLoading(false);
      return;
    }
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all required data in parallel
        const [doctorsRes, patientsRes, appointmentsRes, todaysAppointmentsRes] = await Promise.all([
          API.get("/doctors"),
          API.get("/patients"),
          API.get("/appointments"),
          API.get(`/appointments?date=${getTodayString()}`),
        ]);

        setStats({
          totalDoctors: Array.isArray(doctorsRes.data) ? doctorsRes.data.length : 0,
          totalPatients: Array.isArray(patientsRes.data) ? patientsRes.data.length : 0,
          totalAppointments: Array.isArray(appointmentsRes.data) ? appointmentsRes.data.length : 0,
          todaysAppointments: Array.isArray(todaysAppointmentsRes.data) ? todaysAppointmentsRes.data.length : 0,
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
      <div className="p-6 mt-16 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mt-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-16">
      <div className="bg-cyan-500 w-full p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">System Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-cyan-500 mb-2">Doctors</h2>
          <p className="text-3xl font-bold">{stats.totalDoctors}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-cyan-500 mb-2">Patients</h2>
          <p className="text-3xl font-bold">{stats.totalPatients}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-cyan-500 mb-2">Appointments</h2>
          <p className="text-3xl font-bold">{stats.totalAppointments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-cyan-500 mb-2">Today's Appointments</h2>
          <p className="text-3xl font-bold">{stats.todaysAppointments}</p>
        </div>
      </div>
    </div>
  );
}
