import { useState, useEffect, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade.jsx";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    scheduledAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalSpent: 0,
    upcomingAppointments: [],
    recentAppointments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "patient") {
      setError("This dashboard is only available to patients.");
      setLoading(false);
      return;
    }

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Fetching patient appointments...");

        // Fetch patient's appointments
        const appointmentsRes = await API.get("/appointments/my", {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        const appointments = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : [];
        
        console.log("=== APPOINTMENTS DEBUG ===");
        console.log("Total appointments:", appointments.length);
        console.log("Sample appointment data:", appointments[0]);
        
        // Calculate stats
        const scheduled = appointments.filter(apt => apt.status === "scheduled");
        const completed = appointments.filter(apt => apt.status === "completed");
        const cancelled = appointments.filter(apt => apt.status === "cancelled");

        console.log("Scheduled:", scheduled.length);
        console.log("Completed:", completed.length);
        console.log("Cancelled:", cancelled.length);

        // Calculate total spent (only completed appointments) - FIXED VERSION
        let totalSpent = 0;
        console.log("\n=== CALCULATING TOTAL SPENT ===");
        
        for (const apt of completed) {
          console.log(`Appointment ${apt._id}:`, {
            status: apt.status,
            doctor: apt.doctor_id?.name,
            fee: apt.doctor_id?.consultation_fee,
            hasDoctor: !!apt.doctor_id,
            hasFee: !!apt.doctor_id?.consultation_fee
          });

          if (apt.doctor_id && apt.doctor_id.consultation_fee) {
            const fee = Number(apt.doctor_id.consultation_fee);
            if (!isNaN(fee)) {
              totalSpent += fee;
              console.log(`  ✓ Added ₹${fee}, Running total: ₹${totalSpent}`);
            } else {
              console.log(`  ✗ Invalid fee value:`, apt.doctor_id.consultation_fee);
            }
          } else {
            console.log(`  ✗ No doctor or fee data for this appointment`);
          }
        }

        console.log(`\nFinal Total Spent: ₹${totalSpent}`);
        console.log("=========================\n");

        // Get upcoming appointments (scheduled, sorted by date)
        const upcoming = scheduled
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);

        // Get recent completed appointments
        const recent = completed
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);

        const statsData = {
          totalAppointments: appointments.length,
          scheduledAppointments: scheduled.length,
          completedAppointments: completed.length,
          cancelledAppointments: cancelled.length,
          totalSpent: totalSpent,
          upcomingAppointments: upcoming,
          recentAppointments: recent
        };

        console.log("Final stats:", statsData);
        setStats(statsData);

      } catch (err) {
        console.error("Error fetching patient data:", err);
        console.error("Error details:", err.response?.data);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
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
    return `${hour}:${m} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          <span className="text-gray-600 font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <FadeInSection>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 mt-14 sm:mt-16">
        {/* Header */}
        {/* Header */}
<div className="bg-cyan-500 w-full p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
  <div className="flex flex-col sm:flex-row justify-between items-center">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                Welcome back, {user.name}! 👋
              </h1>
      <p className="text-gray-600 text-sm sm:text-base">
        Your health overview • {new Date().toLocaleDateString()}
      </p>
      <p className="text-gray-700 text-xs mt-1">
        Total Appointments: {stats.totalAppointments} | Completed: {stats.completedAppointments} | Total Spent: ₹{stats.totalSpent.toLocaleString()}
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-0">
      <Link to="/book-appointment">
        <button className="w-full sm:w-auto bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 text-sm font-medium">
          Book Appointment
        </button>
      </Link>
    </div>
  </div>
</div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Appointments */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalAppointments}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Scheduled */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Scheduled</p>
                <p className="text-3xl font-bold text-gray-800">{stats.scheduledAppointments}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completedAppointments}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-gray-800">₹{stats.totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">{stats.completedAppointments} completed visits</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your component stays the same... */}
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
              <Link to="/my-appointments">
                <button className="text-cyan-600 text-sm font-medium hover:text-cyan-700">
                  View All →
                </button>
              </Link>
            </div>

            {stats.upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-2">No upcoming appointments</p>
                <Link to="/book-appointment">
                  <button className="text-cyan-600 text-sm font-medium hover:underline">
                    Book your first appointment
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.upcomingAppointments.map((apt) => (
                  <div key={apt._id} className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-800">{apt.doctor_id?.name || "Unknown Doctor"}</h3>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                            Scheduled
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{apt.doctor_id?.specialization || "Specialist"}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(apt.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(apt.time)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Appointments</h2>
              <Link to="/my-appointments">
                <button className="text-cyan-600 text-sm font-medium hover:text-cyan-700">
                  View All →
                </button>
              </Link>
            </div>

            {stats.recentAppointments.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No completed appointments yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentAppointments.map((apt) => (
                  <div key={apt._id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-800">{apt.doctor_id?.name || "Unknown Doctor"}</h3>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Completed
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{apt.doctor_id?.specialization || "Specialist"}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span>{formatDate(apt.date)}</span>
                          <span>{formatTime(apt.time)}</span>
                        </div>
                        {apt.doctor_id?.consultation_fee && (
                          <p className="text-sm font-medium text-green-600">
                            Fee: ₹{apt.doctor_id.consultation_fee.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/book-appointment" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg p-4 hover:from-cyan-600 hover:to-blue-600 transition-all">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div>
                  <p className="font-semibold">Book Appointment</p>
                  <p className="text-xs text-cyan-100">Schedule a new visit</p>
                </div>
              </div>
            </Link>

            <Link to="/my-appointments" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 hover:from-purple-600 hover:to-pink-600 transition-all">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div>
                  <p className="font-semibold">My Appointments</p>
                  <p className="text-xs text-purple-100">View all appointments</p>
                </div>
              </div>
            </Link>

            <Link to="/my-appointments" className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg p-4 hover:from-green-600 hover:to-teal-600 transition-all">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="font-semibold">Prescriptions</p>
                  <p className="text-xs text-green-100">View medical records</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
