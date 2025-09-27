import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bgImage from "../assets/bg.png";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade";

export default function AddAppointment({ onAdded }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    date: "",
    time: "",
    status: "scheduled"
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [calendarKey, setCalendarKey] = useState(0);

  // Helper function to validate dates
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime()) && date.getTime() > 0;
  };

  // Get status color for calendar events
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#0891b2';
      case 'completed': return '#059669';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  };

  // Fetch appointments for calendar with proper ISO date handling
  const fetchAppointments = useCallback(async () => {
    try {
      const token = user?.token || localStorage.getItem("token") || "";
      const appointmentsRes = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(appointmentsRes.data);

      const events = appointmentsRes.data
        .map(appointment => {
          try {
            if (!appointment || !appointment._id) return null;
            if (!appointment.date || !appointment.time) return null;

            let appointmentDate = appointment.date;
            const appointmentTime = appointment.time;

            if (appointmentDate.includes('T')) {
              appointmentDate = appointmentDate.split('T')[0];
            }

            if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) return null;

            let formattedTime = appointmentTime;
            if (typeof appointmentTime === 'string') {
              const timeParts = appointmentTime.split(':');
              if (timeParts.length === 2) {
                formattedTime = `${appointmentTime}:00`;
              } else if (timeParts.length !== 3) {
                return null;
              }
              if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(formattedTime)) return null;
            } else {
              return null;
            }

            const startDateTime = `${appointmentDate}T${formattedTime}`;
            const startDate = new Date(startDateTime);
            if (!isValidDate(startDate)) return null;
            const endDate = new Date(startDate.getTime() + (60 * 60 * 1000));
            if (!isValidDate(endDate)) return null;
            const endDateTime = endDate.toISOString().slice(0, 19);

            return {
              id: appointment._id,
              title: `${appointment.patient_id?.name || 'Unknown Patient'}`,
              start: startDateTime,
              end: endDateTime,
              backgroundColor: getStatusColor(appointment.status),
              borderColor: getStatusColor(appointment.status),
              textColor: '#ffffff',
              allDay: false,
              extendedProps: {
                patientName: appointment.patient_id?.name || 'Unknown Patient',
                doctorName: appointment.doctor_id?.name || 'Unknown Doctor',
                status: appointment.status || 'scheduled',
                appointmentId: appointment._id,
                originalDate: appointment.date,
                originalTime: appointment.time
              }
            };
          } catch {
            return null;
          }
        })
        .filter(event => event !== null);

      setCalendarEvents(events);
      setCalendarKey(prev => prev + 1);
    } catch (err) {
      setError("Failed to load appointments for calendar. Please try refreshing the page.");
    }
  }, [user]);

 useEffect(() => {
  const fetchLists = async () => {
    try {
      const token = user?.token || localStorage.getItem("token") || "";

      const [patientsRes, doctorsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: [] })),
        axios.get("http://localhost:5000/api/doctors").catch(() => ({ data: [] }))
      ]);

      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);

      // Set default patient
      if (Array.isArray(patientsRes.data) && patientsRes.data.length > 0 && !formData.patient_id) {
        setFormData((prev) => ({ ...prev, patient_id: patientsRes.data[0]._id }));
      }
      
      // Set default doctor based on user role
      if (user?.role === "doctor") {
        // For doctors, find their own ID in the doctors list and set it
        const currentDoctor = doctorsRes.data.find(doctor => doctor.email === user.email);
        if (currentDoctor) {
          setFormData((prev) => ({ ...prev, doctor_id: currentDoctor._id }));
        }
      } else {
        // For admin users, set first doctor as default
        if (Array.isArray(doctorsRes.data) && doctorsRes.data.length > 0 && !formData.doctor_id) {
          setFormData((prev) => ({ ...prev, doctor_id: doctorsRes.data[0]._id }));
        }
      }
    } catch {
      setError("Failed to load patients or doctors list. Please refresh the page.");
    }
  };

  fetchLists();
  fetchAppointments();
}, [fetchAppointments, user]);


  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      .fc {
        font-family: inherit;
      }
      .fc-toolbar-title {
        font-size: 1.25rem !important;
        font-weight: 600 !important;
      }
      .fc-button {
        background-color: #0891b2 !important;
        border-color: #0891b2 !important;
        font-weight: 500 !important;
      }
      .fc-button:hover {
        background-color: #0e7490 !important;
        border-color: #0e7490 !important;
      }
      .fc-button:focus {
        box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.2) !important;
      }
      .fc-event {
        cursor: pointer;
        font-size: 0.875rem;
        border-radius: 4px;
        margin: 1px 0;
        border: none !important;
      }
      .fc-event:hover {
        opacity: 0.8;
        transform: translateY(-1px);
        transition: all 0.2s ease;
      }
      .fc-daygrid-event {
        padding: 2px 4px;
      }
      .fc-event-title {
        font-weight: 500;
      }
      .fc-daygrid-day:hover {
        background-color: rgba(8, 145, 178, 0.05);
        cursor: pointer;
      }
      .fc-day-today {
        background-color: rgba(8, 145, 178, 0.1) !important;
      }
      .fc-event-content {
        padding: 2px;
      }
      .calendar-container {
        min-height: 500px;
      }
    `;
    document.head.appendChild(styleSheet);

    // Cleanup styles when component unmounts
    return () => {
      if (styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);

  try {
    if (!formData.patient_id || !formData.doctor_id || !formData.date || !formData.time) {
      throw new Error("All fields are required.");
    }

    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (selectedDate < now) {
      throw new Error("Cannot schedule appointments in the past.");
    }

    const token = user?.token || localStorage.getItem("token") || "";

    await axios.post("http://localhost:5000/api/appointments", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSuccess("Appointment added successfully!");

    setFormData({
      patient_id: patients.length > 0 ? patients[0]._id : "",
      doctor_id: doctors.length > 0 ? doctors[0]._id : "",
      date: "",
      time: "",
      status: "scheduled"
    });

    setTimeout(() => {
      fetchAppointments();
    }, 1000);

    if (onAdded) onAdded();

    // Navigate to previous page
    navigate(-1);

  } catch (err) {
    const errorMessage = err.message ||
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Error adding appointment. Please try again.";
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


  const handleEventClick = (clickInfo) => {
    try {
      const appointmentId = clickInfo.event.extendedProps?.appointmentId;
      if (appointmentId) {
        navigate(`/doctorprescription/${appointmentId}`);
      }
    } catch {
      setError("Error opening appointment details.");
    }
  };

  const handleDateClick = (dateClickInfo) => {
    try {
      const clickedDate = dateClickInfo.dateStr;
      setFormData(prev => ({
        ...prev,
        date: clickedDate
      }));
    } catch {
    }
  };

  return (
    <FadeInSection>
      <div
        className="min-h-screen py-8 px-4"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto mt-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Calendar Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Appointments Calendar</h2>
                <div className="flex flex-wrap gap-4 text-sm mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-cyan-600 rounded mr-2"></div>
                    <span>Scheduled</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
                    <span>Cancelled</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Total appointments: {calendarEvents.length}
                </div>
              </div>

              <div className="calendar-container">
                <FullCalendar
                  key={calendarKey}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={calendarEvents}
                  eventClick={handleEventClick}
                  dateClick={handleDateClick}
                  height="auto"
                  eventDisplay="block"
                  dayMaxEvents={3}
                  moreLinkClick="popover"
                  eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'short'
                  }}
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  allDaySlot={false}
                  eventDidMount={(info) => {
                    try {
                      const props = info.event.extendedProps;
                      info.el.title = `Patient: ${props.patientName}\nDoctor: ${props.doctorName}\nStatus: ${props.status}\nTime: ${props.originalTime}`;
                    } catch {}
                  }}
                  eventContent={(eventInfo) => {
                    try {
                      return (
                        <div className="fc-event-content">
                          <div className="fc-event-title">{eventInfo.event.title}</div>
                          <div className="text-xs opacity-90">
                            {eventInfo.event.extendedProps.doctorName}
                          </div>
                        </div>
                      );
                    } catch {
                      return <div>Event</div>;
                    }
                  }}
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Click on any appointment to view details • Click on a date to schedule new appointment
              </div>
            </div>

            {/* Add Appointment Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6">Add Appointment</h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <strong>Error:</strong> {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <strong>Success:</strong> {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Field */}
                <div>
                  <label className="block mb-2 font-medium" htmlFor="patient_id">
                    Patient *
                  </label>
                  <select
                    id="patient_id"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.name} {patient.email ? `(${patient.email})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Field - Modified to show logged-in doctor for doctor users */}
                <div>
                  <label className="block mb-2 font-medium" htmlFor="doctor_id">
                    Doctor *
                  </label>
                  {user?.role === "doctor" ? (
                    // Read-only field showing the logged-in doctor's name
                    <div className="w-full border border-gray-300 bg-gray-100 rounded px-4 py-2 text-gray-700">
                      {user.name} - {user.specialization || 'Doctor'}
                    </div>
                  ) : (
                    // Dropdown for admin users
                    <select
                      id="doctor_id"
                      name="doctor_id"
                      value={formData.doctor_id}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  )}
                </div>


                {/* Date Field */}
                <div>
                  <label className="block mb-2 font-medium" htmlFor="date">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Time Field */}
                <div>
                  <label className="block mb-2 font-medium" htmlFor="time">
                    Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Status Field */}
                <div>
                  <label className="block mb-2 font-medium" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-600 text-white py-2.5 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-400 font-medium text-sm mt-6"
                >
                  {loading ? "Adding..." : "Add Appointment"}
                </button>

                {/* Recent Appointments */}
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">Recent Appointments</h3>
                  <div className="space-y-2 max-h-24 overflow-y-auto">
                    {appointments.slice(-2).map((appointment) => (
                      <div key={appointment._id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                        <div>
                          <div className="font-medium">{appointment.patient_id?.name || 'Unknown'}</div>
                          <div className="text-gray-500">{appointment.date}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          appointment.status === 'scheduled' ? 'bg-cyan-100 text-cyan-800' :
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </FadeInSection>
  );
}

