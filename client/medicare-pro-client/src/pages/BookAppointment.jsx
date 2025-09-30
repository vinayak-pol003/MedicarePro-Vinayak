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
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function PatientBookAppointment({ onAdded, patientData }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    date: "",
    time: "",
    status: "scheduled"
  });

  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [calendarKey, setCalendarKey] = useState(0);
  const [patientId, setPatientId] = useState(null);

  // Helper functions
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime()) && date.getTime() > 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#0891b2';
      case 'completed': return '#059669';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  };

  // Get patient ID first
  useEffect(() => {
    const getPatientId = async () => {
      if (!user?.token || !user?.email) return;

      try {
        // If patientData is passed as prop, use it
        if (patientData && patientData._id) {
          setPatientId(patientData._id);
          setFormData(prev => ({
            ...prev,
            patient_id: patientData._id
          }));
          return;
        }

        // Otherwise, fetch patient by email
        const token = user.token || localStorage.getItem("token") || "";
        const response = await axios.get(
          `${BASE_URL}/api/patients/check-by-email/${encodeURIComponent(user.email)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.exists && response.data.patient) {
          const fetchedPatientId = response.data.patient._id;
          setPatientId(fetchedPatientId);
          setFormData(prev => ({
            ...prev,
            patient_id: fetchedPatientId
          }));
        } else {
          setError("Patient record not found. Please contact support.");
        }
      } catch (err) {
        console.error("Error fetching patient ID:", err);
        setError("Failed to load patient information.");
      }
    };

    getPatientId();
  }, [user, patientData]);

  // Fetch patient's appointments only
  const fetchMyAppointments = useCallback(async () => {
    if (!user?.token || !patientId) return;

    try {
      const token = user.token || localStorage.getItem("token") || "";
      
      // Fetch only patient's appointments using patient_id
      const appointmentsRes = await axios.get(
        `${BASE_URL}/api/appointments/patient/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMyAppointments(appointmentsRes.data);

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

            return {
              id: appointment._id,
              title: `Dr. ${appointment.doctor_id?.name || 'Unknown Doctor'}`,
              start: startDateTime,
              end: startDateTime,
              backgroundColor: getStatusColor(appointment.status),
              borderColor: getStatusColor(appointment.status),
              textColor: '#ffffff',
              allDay: false,
              extendedProps: {
                doctorName: appointment.doctor_id?.name || 'Unknown Doctor',
                specialization: appointment.doctor_id?.specialization || 'General',
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
      console.error("Error fetching appointments:", err);
      setError("Failed to load your appointments.");
    }
  }, [user, patientId]);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!user?.token) return;

      try {
        const token = user.token || localStorage.getItem("token") || "";
        const doctorsRes = await axios.get(`${BASE_URL}/api/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setDoctors(doctorsRes.data || []);

        // Set default doctor
        if (Array.isArray(doctorsRes.data) && doctorsRes.data.length > 0 && !formData.doctor_id) {
          setFormData((prev) => ({ ...prev, doctor_id: doctorsRes.data[0]._id }));
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors list.");
      }
    };

    fetchDoctors();
  }, [user?.token]);

  // Fetch appointments when patient ID is available
  useEffect(() => {
    if (patientId) {
      fetchMyAppointments();
    }
  }, [patientId, fetchMyAppointments]);

  // Calendar styling
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
        cursor: default;
        font-size: 0.875rem;
        border-radius: 4px;
        margin: 1px 0;
        border: none !important;
      }
      .fc-event:hover {
        opacity: 0.9;
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
      // Ensure we have the patient ID
      const submitData = {
        ...formData,
        patient_id: patientId
      };

      console.log("Submitting appointment data:", submitData);

      if (!submitData.patient_id || !submitData.doctor_id || !submitData.date || !submitData.time) {
        throw new Error("All fields are required.");
      }

      const selectedDate = new Date(`${submitData.date}T${submitData.time}`);
      const now = new Date();
      if (selectedDate < now) {
        throw new Error("Cannot schedule appointments in the past.");
      }

      const token = user?.token || localStorage.getItem("token") || "";

      await axios.post(`${BASE_URL}/api/appointments`, submitData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Appointment booked successfully!");
      toast.success("Your appointment has been booked successfully!");

      // Reset form
      setFormData({
        patient_id: patientId,
        doctor_id: doctors.length > 0 ? doctors[0]._id : "",
        date: "",
        time: "",
        status: "scheduled"
      });

      setTimeout(() => {
        fetchMyAppointments();
      }, 1000);

      if (onAdded) onAdded();

      setTimeout(() => {
        navigate('/my-appointments');
      }, 2000);

    } catch (err) {
      const errorMessage = err.message ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error booking appointment. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
      // Silent error handling
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

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

            {/* Calendar Section - Patient's Appointments Only */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">My Appointments Calendar</h2>
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
                  Your appointments: {calendarEvents.length}
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
                      info.el.title = `Doctor: ${props.doctorName}\nSpecialization: ${props.specialization}\nStatus: ${props.status}\nTime: ${props.originalTime}`;
                    } catch {}
                  }}
                  eventContent={(eventInfo) => {
                    try {
                      return (
                        <div className="fc-event-content">
                          <div className="fc-event-title">{eventInfo.event.title}</div>
                          <div className="text-xs opacity-90">
                            {eventInfo.event.extendedProps.specialization}
                          </div>
                        </div>
                      );
                    } catch {
                      return <div>Appointment</div>;
                    }
                  }}
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Click on a date to schedule new appointment • View your existing appointments above
              </div>
            </div>

            {/* Book Appointment Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6">Book New Appointment</h2>

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
                {/* Patient Field - Read Only */}
                <div>
                  <label className="block mb-2 font-medium" htmlFor="patient_name">
                    Patient Name
                  </label>
                  <div className="w-full border border-gray-300 bg-gray-100 rounded px-4 py-2 text-gray-700">
                    {user?.name || 'Current User'}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">This appointment will be booked for you</p>
                </div>

                {/* Doctor Field */}
                <div>
                  <label className="block mb-2 font-medium" htmlFor="doctor_id">
                    Select Doctor *
                  </label>
                  <select
                    id="doctor_id"
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name} - {doctor.specialization}
                        {doctor.consultation_fee && ` (₹${doctor.consultation_fee})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Field */}
                <div>
                  <label className="block mb-2 font-medium" htmlFor="date">
                    Appointment Date *
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
                    Appointment Time *
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
                  <p className="text-sm text-gray-500 mt-1">Select your preferred appointment time</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !patientId}
                  className="w-full bg-cyan-600 text-white py-2.5 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-400 font-medium text-sm mt-6"
                >
                  {loading ? "Booking..." : "Book Appointment"}
                </button>

                {/* Recent Appointments - Patient's Own Only */}
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">Your Recent Appointments</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {myAppointments.slice(-3).map((appointment) => (
                      <div key={appointment._id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                        <div>
                          <div className="font-medium">Dr. {appointment.doctor_id?.name || 'Unknown'}</div>
                          <div className="text-gray-500">{appointment.doctor_id?.specialization}</div>
                          <div className="text-gray-500">{appointment.date} at {appointment.time}</div>
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
                    {myAppointments.length === 0 && (
                      <div className="text-gray-500 text-center py-4">
                        No appointments yet. Book your first appointment!
                      </div>
                    )}
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
