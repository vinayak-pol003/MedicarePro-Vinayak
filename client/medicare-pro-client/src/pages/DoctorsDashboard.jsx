import { useState, useEffect, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade.jsx";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const BASE_URL = import.meta.env.VITE_API_URL;


export default function DoctorDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    scheduledAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    averageRating: 0,
    totalEarnings: 0,
    todaysAppointments: 0,
  });
  
  const [chartData, setChartData] = useState({
    monthlyEarnings: [],
    appointmentTrends: [],
    weeklyAppointments: [],
    ratingTrends: []
  });
  
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Real-time data processing function for doctor-specific data
  const processDoctorData = (appointments, patients, doctor) => {
    console.log("Processing doctor data with", appointments.length, "appointments and", patients.length, "patients");
    
    // Helper functions
    const getDayName = (dateString) => {
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    };

    // **FIXED: Get current week dates with precise filtering**
    const getCurrentWeekDates = () => {
      const today = new Date();
      const currentDay = today.getDay(); // 0 = Sunday
      
      // Calculate start of week (Sunday) in local timezone
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - currentDay);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        // Format date as YYYY-MM-DD in local timezone to avoid UTC issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        const todayString = today.toISOString().split('T')[0];
        
        weekDates.push({
          date: dateString,
          dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
          fullDayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
          isToday: dateString === todayString
        });
      }
      
      console.log("=== CURRENT WEEK DATES ===");
      console.log("Today:", today.toISOString().split('T')[0]);
      console.log("Week range:", weekDates[0].date, "to", weekDates[6].date);
      console.log("Week dates:", weekDates.map(d => `${d.dayName}: ${d.date}`));
      
      return weekDates;
    };

    // **FIXED: Group appointments by day - ONLY current week with strict filtering**
    const groupAppointmentsByDay = () => {
      const weekDates = getCurrentWeekDates();
      
      // Create Set of current week dates for O(1) lookup
      const currentWeekDatesSet = new Set(weekDates.map(d => d.date));
      
      const dayGroups = weekDates.reduce((groups, dayInfo) => {
        groups[dayInfo.dayName] = {
          day: dayInfo.dayName,
          fullDay: dayInfo.fullDayName,
          appointments: 0,
          earnings: 0,
          appointmentsList: [],
          date: dayInfo.date,
          isToday: dayInfo.isToday
        };
        return groups;
      }, {});

      console.log("=== WEEKLY APPOINTMENT FILTERING ===");
      console.log("Valid dates for this week:", Array.from(currentWeekDatesSet));

      let includedCount = 0;
      let excludedCount = 0;

      appointments.forEach((appointment, index) => {
        if (!appointment.date) {
          console.log(`❌ EXCLUDED: No date - ${appointment.patient_id?.name || 'Unknown'}`);
          excludedCount++;
          return;
        }

        try {
          // Extract date part from appointment date
          let appointmentDate;
          if (appointment.date.includes('T')) {
            appointmentDate = appointment.date.split('T')[0];
          } else if (appointment.date.includes('-') && appointment.date.length === 10) {
            appointmentDate = appointment.date;
          } else {
            const dateObj = new Date(appointment.date);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            appointmentDate = `${year}-${month}-${day}`;
          }
          
          console.log(`Appointment ${index + 1}: Date = ${appointmentDate}, Patient = ${appointment.patient_id?.name || 'Unknown'}`);
          
          // **STRICT CURRENT WEEK CHECK: Only include appointments from this specific week**
          if (currentWeekDatesSet.has(appointmentDate)) {
            const dayName = getDayName(appointmentDate);
            
            console.log(`✅ INCLUDED: ${appointmentDate} (${dayName}) - ${appointment.patient_id?.name || 'Unknown'}`);
            includedCount++;
            
            if (dayGroups[dayName]) {
              // Count all non-deleted appointments
              if (!appointment.isDeleted) {
                dayGroups[dayName].appointments++;
              }

              // Only add earnings for completed appointments
              if (appointment.status === 'completed') {
                dayGroups[dayName].earnings += doctor?.consultation_fee || 0;
              }

              // Add to appointments list for tooltip (excluding deleted)
              if (!appointment.isDeleted) {
                dayGroups[dayName].appointmentsList.push({
                  id: appointment._id,
                  patientName: appointment.patient_id?.name || 'Unknown',
                  time: appointment.time,
                  status: appointment.status,
                  rating: appointment.rating || 0,
                  date: appointmentDate
                });
              }
            }
          } else {
            console.log(`❌ EXCLUDED: ${appointmentDate} - NOT in current week (${appointment.patient_id?.name || 'Unknown'})`);
            excludedCount++;
          }
        } catch (err) {
          console.warn('Error processing appointment date:', appointment.date, err);
          excludedCount++;
        }
      });

      console.log("=== FILTERING SUMMARY ===");
      console.log(`Total appointments processed: ${appointments.length}`);
      console.log(`Included in current week: ${includedCount}`);
      console.log(`Excluded (other weeks/invalid): ${excludedCount}`);

      const result = Object.values(dayGroups).sort((a, b) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.indexOf(a.day) - days.indexOf(b.day);
      });
      
      console.log("=== FINAL WEEKLY RESULT ===");
      result.forEach(day => {
        console.log(`${day.day} (${day.date}): ${day.appointments} appointments, ₹${day.earnings} earnings`);
        if (day.appointments > 0) {
          day.appointmentsList.forEach(apt => {
            console.log(`  • ${apt.time} - ${apt.patientName} (${apt.status})`);
          });
        }
      });
      
      return result;
    };

    // Generate monthly earnings data - Fixed to handle deleted appointments
    const generateMonthlyEarnings = () => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      const monthlyData = [];

      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const monthAppointments = appointments.filter(appointment => {
          if (!appointment.date) return false;
          const appointmentDate = new Date(appointment.date);
          return appointmentDate.getMonth() === monthIndex && 
                 appointmentDate.getFullYear() === currentYear &&
                 appointment.status !== 'deleted'; // Exclude deleted appointments
        });

        // Only count completed appointments for earnings, regardless of deletion
        const completedAppointments = monthAppointments.filter(apt => apt.status === 'completed');
        const completedCount = completedAppointments.length;
        const earnings = completedCount * (doctor?.consultation_fee || 0);

        monthlyData.push({
          month: monthNames[monthIndex],
          earnings: earnings,
          appointments: completedCount,
          year: currentYear
        });
      }

      console.log("Monthly earnings data:", monthlyData);
      return monthlyData;
    };

    // Generate appointment trends - Fixed to exclude deleted appointments
    const generateAppointmentTrends = () => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      const monthlyData = [];

      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const monthAppointments = appointments.filter(appointment => {
          if (!appointment.date) return false;
          const appointmentDate = new Date(appointment.date);
          return appointmentDate.getMonth() === monthIndex && 
                 appointmentDate.getFullYear() === currentYear &&
                 !appointment.isDeleted; // Exclude deleted appointments
        });

        const scheduled = monthAppointments.filter(apt => apt.status === 'scheduled').length;
        const completed = monthAppointments.filter(apt => apt.status === 'completed').length;
        const cancelled = monthAppointments.filter(apt => apt.status === 'cancelled').length;

        monthlyData.push({
          month: monthNames[monthIndex],
          scheduled: scheduled,
          completed: completed,
          cancelled: cancelled,
          year: currentYear,
          total: monthAppointments.length
        });
      }

      return monthlyData;
    };

    // Generate rating trends over time - Fixed to exclude deleted appointments
    const generateRatingTrends = () => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      const ratingData = [];

      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const monthAppointments = appointments.filter(appointment => {
          if (!appointment.date || !appointment.rating) return false;
          const appointmentDate = new Date(appointment.date);
          return appointmentDate.getMonth() === monthIndex && 
                 appointmentDate.getFullYear() === currentYear &&
                 appointment.status === 'completed' &&
                 appointment.status !== 'deleted'; // Exclude deleted appointments
        });

        const ratings = monthAppointments.map(apt => apt.rating).filter(rating => rating > 0);
        const averageRating = ratings.length > 0 
          ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
          : 0;

        ratingData.push({
          month: monthNames[monthIndex],
          rating: parseFloat(averageRating),
          totalRatings: ratings.length,
          year: currentYear
        });
      }

      return ratingData;
    };

    return {
      monthlyEarnings: generateMonthlyEarnings(),
      appointmentTrends: generateAppointmentTrends(),
      weeklyAppointments: groupAppointmentsByDay(),
      ratingTrends: generateRatingTrends()
    };
  };

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      setError("This dashboard is only available to doctors.");
      setLoading(false);
      return;
    }
    
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        setError("");

        // Get doctor profile first
        const doctorProfileRes = await API.get("/doctors/me", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        const doctorProfile = doctorProfileRes.data;
        setDoctorProfile(doctorProfile);

        // Get all data in parallel
        const [appointmentsRes, patientsRes, todaysAppointmentsRes] = await Promise.all([
          API.get("/appointments", {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          API.get("/patients", {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          API.get("/appointments/today", {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ]);

        // Filter data for this doctor only
        const allAppointments = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : [];
        const allPatients = Array.isArray(patientsRes.data) ? patientsRes.data : [];
        const todaysAppointments = Array.isArray(todaysAppointmentsRes.data) ? todaysAppointmentsRes.data : [];

        // Filter appointments for this doctor
        const doctorAppointments = allAppointments.filter(apt => 
          apt.doctor_id?._id === doctorProfile._id || apt.doctor_id === doctorProfile._id
        );

        // **NEW: Enhanced patient counting - both assigned AND appointment patients**
        // 1. Get directly assigned patients
        const directlyAssignedPatients = allPatients.filter(patient => 
          patient.doctor_id?._id === doctorProfile._id || patient.doctor_id === doctorProfile._id
        );

        // 2. Get unique patients from appointments (who may not be directly assigned)
        const appointmentPatientIds = new Set(
          doctorAppointments
            .filter(apt => apt.patient_id && !apt.isDeleted) // Only non-deleted appointments with patient_id
            .map(apt => {
              // Handle both object and string patient_id formats
              if (typeof apt.patient_id === 'object') {
                return apt.patient_id._id;
              }
              return apt.patient_id;
            })
        );

        // 3. Get patient details from appointments
        const appointmentPatients = allPatients.filter(patient => 
          appointmentPatientIds.has(patient._id)
        );

        // 4. Combine and deduplicate patients
        const allUniquePatientIds = new Set();
        const combinedPatients = [];

        // Add directly assigned patients
        directlyAssignedPatients.forEach(patient => {
          if (!allUniquePatientIds.has(patient._id)) {
            allUniquePatientIds.add(patient._id);
            combinedPatients.push({...patient, source: 'assigned'});
          }
        });

        // Add appointment patients (if not already included)
        appointmentPatients.forEach(patient => {
          if (!allUniquePatientIds.has(patient._id)) {
            allUniquePatientIds.add(patient._id);
            combinedPatients.push({...patient, source: 'appointment'});
          }
        });

        console.log("=== PATIENT COUNTING ===");
        console.log("Directly assigned patients:", directlyAssignedPatients.length);
        console.log("Unique appointment patient IDs:", appointmentPatientIds.size);
        console.log("Total unique patients:", combinedPatients.length);
        console.log("Combined patients breakdown:", {
          assigned: combinedPatients.filter(p => p.source === 'assigned').length,
          fromAppointments: combinedPatients.filter(p => p.source === 'appointment').length
        });

        // Filter today's appointments for this doctor
        const doctorTodaysAppointments = todaysAppointments.filter(apt => 
          apt.doctor_id?._id === doctorProfile._id || apt.doctor_id === doctorProfile._id
        );

        setAppointmentsData(doctorAppointments);
        setPatientsData(combinedPatients); // **UPDATED: Use combined patient list**

        // FIXED: Calculate statistics excluding deleted appointments but preserving earnings
        const activeAppointments = doctorAppointments.filter(apt => !apt.isDeleted);
        const scheduledCount = activeAppointments.filter(apt => apt.status === 'scheduled').length;
        const completedCount = activeAppointments.filter(apt => apt.status === 'completed').length;
        const cancelledCount = activeAppointments.filter(apt => apt.status === 'cancelled').length;

        // Calculate average rating from active completed appointments only
        const ratedAppointments = activeAppointments.filter(apt =>
          apt.rating && apt.rating > 0 && apt.status === 'completed'
        );
        const averageRating = ratedAppointments.length > 0
          ? (ratedAppointments.reduce((sum, apt) => sum + apt.rating, 0) / ratedAppointments.length).toFixed(1)
          : 0;

        // FIXED: Calculate total earnings from ALL completed appointments (including historical ones that might be deleted later)
        const allCompletedCount = doctorAppointments.filter(apt => apt.status === 'completed').length;
        const totalEarnings = allCompletedCount * (doctorProfile.consultation_fee || 0);

        const statsData = {
          totalPatients: combinedPatients.length, // **UPDATED: Use combined count**
          totalAppointments: activeAppointments.length,
          scheduledAppointments: scheduledCount,
          completedAppointments: completedCount,
          cancelledAppointments: cancelledCount,
          averageRating: parseFloat(averageRating),
          totalEarnings: totalEarnings,
          todaysAppointments: doctorTodaysAppointments.length,
        };

        console.log("Doctor stats data:", statsData);
        console.log("Total appointments (active):", activeAppointments.length);
        console.log("Completed appointments:", completedCount);
        console.log("Total earnings:", totalEarnings);
        
        setStats(statsData);
        
        // Process chart data with active appointments only
        const charts = processDoctorData(activeAppointments, combinedPatients, doctorProfile);
        console.log("Generated doctor charts:", charts);
        setChartData(charts);
        
      } catch (err) {
        console.error("Doctor dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [user]);

  // Custom tooltips
  const EarningsTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border-2 border-green-200 rounded-lg shadow-xl">
          <p className="text-green-800 font-semibold text-sm">{label} {data.year}</p>
          <p className="text-green-600 text-sm font-medium">Earnings: ₹{payload[0].value}</p>
          <p className="text-green-500 text-xs">Completed: {data.appointments} appointments</p>
        </div>
      );
    }
    return null;
  };

  const RatingTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border-2 border-yellow-200 rounded-lg shadow-xl">
          <p className="text-yellow-800 font-semibold text-sm">{label} {data.year}</p>
          <p className="text-yellow-600 text-sm font-medium">Rating: {payload[0].value}/5 ⭐</p>
          <p className="text-yellow-500 text-xs">From {data.totalRatings} reviews</p>
        </div>
      );
    }
    return null;
  };

  const WeeklyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border-2 border-blue-200 rounded-lg shadow-xl max-w-sm">
          <p className="text-blue-800 font-semibold text-sm">
            {data.fullDay} {data.isToday ? '(Today)' : ''}
          </p>
          <p className="text-blue-600 text-sm font-medium mb-2">
            Appointments: {payload[0].value}
          </p>
          <p className="text-green-600 text-sm">
            Earnings: ₹{data.earnings}
          </p>
          
          {data.appointmentsList && data.appointmentsList.length > 0 && (
            <div className="text-xs text-gray-600 max-h-24 overflow-y-auto mt-2">
              <p className="font-semibold mb-1">Appointments:</p>
              {data.appointmentsList.slice(0, 3).map((apt, index) => (
                <p key={index} className="text-xs">
                  {apt.time} - {apt.patientName} 
                  {apt.rating > 0 && ` (⭐${apt.rating})`}
                </p>
              ))}
              {data.appointmentsList.length > 3 && (
                <p className="text-xs italic">+{data.appointmentsList.length - 3} more...</p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                {doctorProfile?.name || user.name}'s Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Your medical practice overview • {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-700 text-xs mt-1">
                Specialization: {doctorProfile?.specialization} | Fee: ₹{doctorProfile?.consultation_fee}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-0">
              <Link to="/appointments">
                <button className="w-full sm:w-auto bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 text-sm font-medium">
                  View Appointments
                </button>
              </Link>
              <Link to="/patients">
                <button className="w-full sm:w-auto bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 text-sm font-medium">
                  Manage Patients
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="col-span-1 rounded-xl bg-[#e6f3ff] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">My Patients</span>
            <span className="text-3xl font-bold text-gray-800">{stats.totalPatients}</span>
            <span className="text-green-500 font-medium text-xs mt-2">All Patients</span>
          </div>
          
          <div className="col-span-1 rounded-xl bg-[#e6f3ff] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Total Appointments</span>
            <span className="text-3xl font-bold text-gray-800">{stats.totalAppointments}</span>
            <span className="text-blue-500 font-medium text-xs mt-2">All Time</span>
          </div>

          <div className="col-span-1 rounded-xl bg-[#e5f8f8] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Scheduled</span>
            <span className="text-3xl font-bold text-gray-800">{stats.scheduledAppointments}</span>
            <span className="text-orange-500 font-medium text-xs mt-2">Upcoming</span>
          </div>

          <div className="col-span-1 rounded-xl bg-[#edf5ff] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Completed</span>
            <span className="text-3xl font-bold text-gray-800">{stats.completedAppointments}</span>
            <span className="text-green-500 font-medium text-xs mt-2">Success</span>
          </div>

          <div className="col-span-1 rounded-xl bg-[#eef6fc] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Cancelled</span>
            <span className="text-3xl font-bold text-gray-800">{stats.cancelledAppointments}</span>
            <span className="text-red-500 font-medium text-xs mt-2">Missed</span>
          </div>

          <div className="col-span-1 rounded-xl bg-[#e6f3ff] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Avg Rating</span>
            <span className="text-3xl font-bold text-gray-800">{stats.averageRating}</span>
            <span className="text-yellow-500 font-medium text-xs mt-2">⭐ Stars</span>
          </div>

          <div className="col-span-1 rounded-xl bg-[#e6f3ff] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Total Earnings</span>
            <span className="text-2xl font-bold text-gray-800">₹{stats.totalEarnings.toLocaleString()}</span>
            <span className="text-green-500 font-medium text-xs mt-2">Revenue</span>
          </div>

          <div className="col-span-1 rounded-xl bg-[#e6f3ff] p-6 shadow flex flex-col items-start">
            <span className="uppercase text-xs text-gray-500 font-semibold mb-1">Today</span>
            <span className="text-3xl font-bold text-gray-800">{stats.todaysAppointments}</span>
            <span className="text-purple-500 font-medium text-xs mt-2">Appointments</span>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Your Practice Analytics</h2>
            <p className="text-gray-600 mb-6">Track your appointments, earnings, and patient feedback</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Monthly Earnings Chart */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">💰 Monthly Earnings</h3>
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    ₹{doctorProfile?.consultation_fee}/appointment
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip content={<EarningsTooltip />} />
                    <Bar dataKey="earnings" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2">
                  Total earned: ₹{stats.totalEarnings.toLocaleString()} from {stats.completedAppointments} completed appointments
                </p>
              </div>

              {/* Rating Trends */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">⭐ Rating Trends</h3>
                  <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    Avg: {stats.averageRating}/5
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.ratingTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} domain={[0, 5]} />
                    <Tooltip content={<RatingTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="rating" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: '#f59e0b' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2">
                  Patient satisfaction rating over time
                </p>
              </div>

              {/* **FIXED: Weekly Appointments - Current Week Only** */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">📅 This Week</h3>
                  <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Current Week Only
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.weeklyAppointments}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip content={<WeeklyTooltip />} />
                    <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2">
                  Weekly appointment schedule and earnings (Current week only - Sep 29 to Oct 5, 2025)
                </p>
              </div>

              {/* Appointment Status Breakdown */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Appointment Status - 2025</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.appointmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="scheduled" stackId="a" fill="#3b82f6" name="Scheduled" />
                    <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                    <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-xs text-gray-600">Scheduled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs text-gray-600">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs text-gray-600">Cancelled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Practice Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full">
            {/* Quick Stats Bars */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col min-h-[250px]">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-gray-900 font-bold text-lg">Practice Summary</div>
                <div className="flex gap-4 text-xs">
                  <div className="text-cyan-700 font-medium">Current Stats</div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4 mt-6 mb-3">
                <div className="flex items-center">
                  <span className="w-28 text-sm text-gray-500">Patients</span>
                  <div className="flex-1 h-7 mx-2 relative rounded-full bg-cyan-100 overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((stats.totalPatients / 50) * 100, 100)}%` }}
                    ></div>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-700 font-semibold">{stats.totalPatients}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="w-28 text-sm text-gray-500">Completed</span>
                  <div className="flex-1 h-7 mx-2 relative rounded-full bg-green-100 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((stats.completedAppointments / 100) * 100, 100)}%` }}
                    ></div>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 font-semibold">{stats.completedAppointments}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="w-28 text-sm text-gray-500">Scheduled</span>
                  <div className="flex-1 h-7 mx-2 relative rounded-full bg-orange-100 overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((stats.scheduledAppointments / 50) * 100, 100)}%` }}
                    ></div>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-700 font-semibold">{stats.scheduledAppointments}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="w-28 text-sm text-gray-500">Rating</span>
                  <div className="flex-1 h-7 mx-2 relative rounded-full bg-yellow-100 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                      style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                    ></div>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-700 font-semibold">{stats.averageRating}/5</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col min-h-[250px]">
              <div className="text-gray-900 font-bold mb-4">Performance Metrics</div>
              <div className="space-y-4 text-gray-700 text-sm">
                <div className="flex justify-between items-center">
                  <span>Completion Rate</span>
                  <span className="font-semibold text-green-600">
                    {stats.totalAppointments > 0 
                      ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cancellation Rate</span>
                  <span className="font-semibold text-red-600">
                    {stats.totalAppointments > 0 
                      ? Math.round((stats.cancelledAppointments / stats.totalAppointments) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg Earnings/Day</span>
                  <span className="font-semibold text-green-600">
                    ₹{Math.round(stats.totalEarnings / 30).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Patient Satisfaction</span>
                  <span className="font-semibold text-yellow-600">{stats.averageRating}/5 ⭐</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Specialization</span>
                  <span className="font-semibold text-blue-600">{doctorProfile?.specialization}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
