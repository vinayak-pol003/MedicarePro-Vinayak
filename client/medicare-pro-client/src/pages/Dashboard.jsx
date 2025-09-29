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

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todaysAppointments: 0,
    totalAdmins: 0,
  });
  const [chartData, setChartData] = useState({
    patientGrowth: [],
    appointmentTrends: [],
    weeklyAppointments: []
  });
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [patientsData, setPatientsData] = useState([]); // Store raw patient data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Max values for bar-filling
  const MAX = {
    doctors: 20,
    patients: 100,
    appointments: 200,
    todaysAppointments: 40,
    admins: 10,
  };

  // Real-time data processing function with actual patient growth from createdAt
  const processRealTimeData = (appointments, patients) => {
    console.log("Processing real-time data with", appointments.length, "appointments and", patients.length, "patients");
    
    // Helper function to get day name from date
    const getDayName = (dateString) => {
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    };

    // Helper function to get current week's date range
    const getCurrentWeekDates = () => {
      const today = new Date();
      const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - currentDay); // Start from Sunday
      
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        weekDates.push({
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
          fullDayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]
        });
      }
      return weekDates;
    };

    // Group appointments by day of week
   // Group appointments by day of week - FIXED to only show appointments for THIS WEEK
const groupAppointmentsByDay = () => {
  const weekDates = getCurrentWeekDates();
  
  // Initialize with 0 appointments for each day
  const dayGroups = weekDates.reduce((groups, dayInfo) => {
    groups[dayInfo.dayName] = {
      day: dayInfo.dayName,
      fullDay: dayInfo.fullDayName,
      appointments: 0,
      appointmentsList: [],
      date: dayInfo.date,
      isToday: dayInfo.date === new Date().toISOString().split('T')[0]
    };
    return groups;
  }, {});

  console.log("=== CURRENT WEEK DATES ===");
  console.log("Week dates:", weekDates.map(d => `${d.dayName}: ${d.date}`));
  
  // Get current week date range for filtering
  const currentWeekDates = weekDates.map(d => d.date); // Array of this week's dates
  const startOfWeek = weekDates[0].date; // Sunday
  const endOfWeek = weekDates[6].date;   // Saturday
  
  console.log(`Current week range: ${startOfWeek} to ${endOfWeek}`);

  // FIXED: Only count appointments that fall within THIS WEEK's date range
  appointments.forEach(appointment => {
    if (appointment.date) {
      try {
        // Extract date part from appointment date
        const appointmentDate = appointment.date.includes('T') 
          ? appointment.date.split('T')[0] 
          : appointment.date;
        
        console.log(`Checking appointment date: ${appointmentDate}`);
        
        // CRITICAL FIX: Only include appointments from this week
        if (currentWeekDates.includes(appointmentDate)) {
          const dayName = getDayName(appointmentDate);
          
          console.log(`✅ Appointment ${appointmentDate} is in current week (${dayName})`);
          
          if (dayGroups[dayName]) {
            dayGroups[dayName].appointments++;
            dayGroups[dayName].appointmentsList.push({
              id: appointment._id,
              patientName: appointment.patient_id?.name || 'Unknown',
              doctorName: appointment.doctor_id?.name || 'Unknown',
              time: appointment.time,
              status: appointment.status,
              date: appointmentDate
            });
          }
        } else {
          console.log(`❌ Appointment ${appointmentDate} is NOT in current week - EXCLUDED`);
        }
      } catch (err) {
        console.warn('Error processing appointment date:', appointment.date, err);
      }
    }
  });

  const result = Object.values(dayGroups).sort((a, b) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.indexOf(a.day) - days.indexOf(b.day);
  });
  
  console.log("=== WEEKLY APPOINTMENTS RESULT ===");
  result.forEach(day => {
    console.log(`${day.day} (${day.date}): ${day.appointments} appointments`);
    if (day.appointments > 0) {
      console.log("  Appointments:", day.appointmentsList.map(apt => `${apt.time} - ${apt.patientName}`));
    }
  });
  
  return result;
};


    // REAL PATIENT GROWTH - Count patients by createdAt month
    const generateRealPatientGrowth = () => {
      console.log("Generating REAL patient growth from", patients.length, "patients");
      console.log("Sample patient data:", patients.slice(0, 2));
      
      // Get current date and generate last 6 months
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Generate last 6 months data structure
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const targetMonth = currentMonth - i;
        const targetYear = currentYear + Math.floor(targetMonth / 12);
        const normalizedMonth = ((targetMonth % 12) + 12) % 12;
        
        last6Months.push({
          month: monthNames[normalizedMonth].slice(0, 3),
          year: targetYear,
          monthIndex: normalizedMonth,
          patients: 0, // Will count real patients
          patientsList: [] // Store patient names for debugging
        });
      }
      
      // Group patients by their ACTUAL createdAt month
      if (Array.isArray(patients) && patients.length > 0) {
        patients.forEach(patient => {
          // Use createdAt field from backend
          const createdAt = patient.createdAt;
          
          if (createdAt) {
            try {
              const patientDate = new Date(createdAt);
              if (!isNaN(patientDate.getTime())) {
                const patientMonth = patientDate.getMonth();
                const patientYear = patientDate.getFullYear();
                
                console.log(`Patient ${patient.name || 'Unknown'} created on:`, patientDate.toDateString(), 
                           `(Month: ${patientMonth}, Year: ${patientYear})`);
                
                // Find matching month in our 6-month window
                const matchingMonth = last6Months.find(monthData => 
                  monthData.monthIndex === patientMonth && monthData.year === patientYear
                );
                
                if (matchingMonth) {
                  matchingMonth.patients++;
                  matchingMonth.patientsList.push(patient.name || 'Unknown');
                  console.log(`Added to ${matchingMonth.month} ${matchingMonth.year}: ${matchingMonth.patients} patients`);
                } else {
                  console.log(`Patient ${patient.name || 'Unknown'} created outside 6-month window:`, patientDate.toDateString());
                }
              } else {
                console.warn('Invalid createdAt date for patient:', patient.name, createdAt);
              }
            } catch (err) {
              console.warn('Error parsing patient createdAt:', createdAt, err);
            }
          } else {
            console.warn('Patient missing createdAt field:', patient.name || 'Unknown');
          }
        });
      }
      
      // Create CUMULATIVE growth pattern (running total)
      let cumulativeCount = 0;
      const result = last6Months.map(monthData => {
        cumulativeCount += monthData.patients;
        console.log(`${monthData.month} ${monthData.year}: +${monthData.patients} new, ${cumulativeCount} total`);
        return {
          month: monthData.month,
          patients: cumulativeCount, // Cumulative total up to this month
          newPatients: monthData.patients, // New patients this month
          year: monthData.year,
          patientsList: monthData.patientsList
        };
      });
      
      console.log("Final patient growth data:", result);
      return result;
    };

    // Generate monthly trends from real appointment data
   // Generate monthly trends from real appointment data - FULL YEAR (Jan-Dec)
const generateMonthlyTrends = () => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear(); // 2025

  const monthlyData = [];

  // Generate ALL 12 MONTHS of current year (Jan-Dec 2025)
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    // Filter appointments for this specific month of current year
    const monthAppointments = appointments.filter(appointment => {
      if (!appointment.date) return false;
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getMonth() === monthIndex && 
             appointmentDate.getFullYear() === currentYear;
    });

    // Group by status
    const scheduled = monthAppointments.filter(apt => apt.status === 'scheduled').length;
    const completed = monthAppointments.filter(apt => apt.status === 'completed').length;
    const cancelled = monthAppointments.filter(apt => apt.status === 'cancelled').length;

    console.log(`${monthNames[monthIndex]} 2025: ${monthAppointments.length} total appointments`);

    monthlyData.push({
      month: monthNames[monthIndex],
      scheduled: scheduled,
      completed: completed,
      cancelled: cancelled,
      year: currentYear,
      total: monthAppointments.length
    });
  }

  console.log("Full year monthly data:", monthlyData);
  return monthlyData;
};


    return {
      patientGrowth: generateRealPatientGrowth(),
      appointmentTrends: generateMonthlyTrends(),
      weeklyAppointments: groupAppointmentsByDay()
    };
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
          API.get("/users"),
        ]);

        // Store raw data arrays
        const appointmentsArray = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : [];
        const patientsArray = Array.isArray(patientsRes.data) ? patientsRes.data : [];
        
        setAppointmentsData(appointmentsArray);
        setPatientsData(patientsArray);

        // Filter admin users from all users
        const adminUsers = Array.isArray(usersRes.data) 
          ? usersRes.data.filter(user => user.role === "admin") 
          : [];

        const statsData = {
          totalDoctors: Array.isArray(doctorsRes.data) ? doctorsRes.data.length : 0,
          totalPatients: patientsArray.length,
          totalAppointments: appointmentsArray.length,
          todaysAppointments: Array.isArray(todaysAppointmentsRes.data) ? todaysAppointmentsRes.data.length : 0,
          totalAdmins: adminUsers.length,
        };

        console.log("Stats data:", statsData);
        console.log("Raw patients data:", patientsArray);

        setStats(statsData);
        
        // Process real-time chart data with actual patient registration dates
        const charts = processRealTimeData(appointmentsArray, patientsArray);
        console.log("Generated real-time charts:", charts);
        setChartData(charts);
        
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, [user]);

  // Enhanced Custom tooltip for patient growth - shows REAL data
  const PatientGrowthTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border-2 border-cyan-200 rounded-lg shadow-xl">
          <p className="text-cyan-800 font-semibold text-sm">
            {label} {data.year}
          </p>
          <p className="text-cyan-600 text-sm font-medium">
            Total Patients: {payload[0].value}
          </p>
          {data.newPatients > 0 && (
            <p className="text-cyan-500 text-xs">
              New this month: {data.newPatients}
            </p>
          )}
          {data.patientsList && data.patientsList.length > 0 && (
            <div className="text-xs text-gray-600 mt-1 max-w-48">
              <p className="font-semibold">Patients:</p>
              <p>{data.patientsList.join(', ')}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Enhanced Custom tooltip for weekly chart
  const WeeklyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border-2 border-emerald-200 rounded-lg shadow-xl max-w-sm">
          <p className="text-emerald-800 font-semibold text-sm">
            {data.fullDay} {data.isToday ? '(Today)' : ''}
          </p>
          <p className="text-emerald-600 text-sm font-medium mb-2">
            Appointments: {payload[0].value}
          </p>
          
          {/* Show appointment details if available */}
          {data.appointmentsList && data.appointmentsList.length > 0 && (
            <div className="text-xs text-gray-600 max-h-24 overflow-y-auto">
              <p className="font-semibold mb-1">Appointments:</p>
              {data.appointmentsList.slice(0, 3).map((apt, index) => (
                <p key={index} className="text-xs">
                  {apt.time} - {apt.patientName}
                </p>
              ))}
              {data.appointmentsList.length > 3 && (
                <p className="text-xs italic">+{data.appointmentsList.length - 3} more...</p>
              )}
            </div>
          )}
          
          {data.isToday && (
            <p className="text-xs text-emerald-500 mt-2">📍 Today</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip component for other charts
  // Enhanced tooltip for full year data
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="text-gray-800 font-medium">{`${label} ${data.year}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
        {data.total && (
          <p className="text-xs text-gray-500 mt-1">Total: {data.total} appointments</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Real-time overview based on actual database records • {new Date().toLocaleDateString()}
              </p>
              
            </div>

            {/* Admin buttons - responsive layout */}
              {user?.role === "admin" && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link to="/add-admin">
                    <button className="w-full sm:w-auto bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 text-sm font-medium">
                      Add Admin
                    </button>
                  </Link>
                  
                  <Link to="/admin/contacts">
                    <button className="w-full sm:w-auto bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 text-sm font-medium">
                      Query Section
                    </button>
                  </Link>
                </div>
              )}              
          </div>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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
            <span className="text-green-500 font-medium text-xs mt-2">Real Data</span>
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

        {/* ANALYTICS SECTION WITH REAL-TIME CHARTS */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Real Database Analytics</h2>
            <p className="text-gray-600 mb-6">Live data from your actual patients and appointments • Based on createdAt timestamps</p>
            
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* REAL Patient Growth Line Chart */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">📈 Real Patient Growth</h3>
                  <div className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                    Database Data
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.patientGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <Tooltip content={<PatientGrowthTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="#0891b2" 
                      strokeWidth={3}
                      dot={{ fill: '#0891b2', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: '#0891b2' }}
                      connectNulls={true}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2">
                  📅 Based on actual patient createdAt timestamps • Total: {stats.totalPatients}
                </p>
              </div>

              {/* Real-Time Weekly Appointments Bar Chart */}
              {/* Real-Time Weekly Appointments Bar Chart */}
<div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-800">📅 This Week's Appointments</h3>
    <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
      Live Data
    </div>
  </div>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData.weeklyAppointments}>
      <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
      <XAxis 
        dataKey="day" 
        stroke="#6b7280"
        fontSize={12}
      />
      <YAxis 
        stroke="#6b7280"
        fontSize={12}
        allowDecimals={false}
        tickFormatter={(value) => Math.floor(value).toString()}
        domain={[0, 'dataMax']}
      />
      <Tooltip content={<WeeklyTooltip />} />
      <Bar 
        dataKey="appointments" 
        fill="#059669"
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
  <p className="text-xs text-gray-500 mt-2">
    📊 Real appointments for current week • Total: {chartData.weeklyAppointments.reduce((sum, day) => sum + day.appointments, 0)}
  </p>
</div>


              {/* Monthly Appointment Trends */}
              <div className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Monthly Appointment Trends - 2025</h3>
  <ResponsiveContainer width="100%" height={350}>
    <BarChart 
      data={chartData.appointmentTrends}
      maxBarSize={40}  // Reduced bar size for 12 months
      barCategoryGap={10}  // Reduced gap for better fit
      barGap={1}  // Smaller gap between stacked bars
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
      <XAxis 
        dataKey="month" 
        stroke="#6b7280"
        fontSize={10}  // Smaller font for 12 months
        interval={0}  // Show all month labels
      />
      <YAxis 
        stroke="#6b7280"
        fontSize={12}
      />
      <Tooltip content={<CustomTooltip />} />
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
  <p className="text-xs text-gray-500 mt-2 text-center">Full year appointment trends for 2025 • Real database data</p>
</div>

            </div>
          </div>
          
          {/* Rest of your existing sections... */}
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
                {/* Admins */}
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
            
            {/* Bookings by Source */}
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
      </div>
    </FadeInSection>
  );
}
