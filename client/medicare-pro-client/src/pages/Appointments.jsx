import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contex/AuthContext.jsx";
import AddAppointment from "./AddAppointment.jsx";
import { Link } from "react-router-dom";

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

  // Form state for adding new appointment
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    date: "",
    time: "",
    status: "scheduled"
  });

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

  const filteredAppointments = appointments.filter(appointment => {
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
      // Refresh appointments
      const response = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
      // Reset form
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh appointments
      const response = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError("Failed to update appointment");
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
      <div className="p-6 mt-16">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
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
        <div className="mb-8 bg-cyan-500" >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointments</h1>
              <p className="text-gray-600">Manage and track all appointments</p>
            </div>
            {["patient", "doctor", "admin"].includes(user?.role) && (
              <button
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
              >
               <Link to='/addappointment'>Add Appointment</Link>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-cyan-500 rounded-lg shadow-md p-6 mb-6">
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

      {/* Add Appointment Form Modal */}
      {showAddForm && (
          <AddAppointment
            onAdded={() => {
              setShowAddForm(false);
              fetchData(); // call your appointments table refresh
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patient_id?.name || 'Unknown Patient'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.patient_id?.email || ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.doctor_id?.name || 'Unknown Doctor'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.doctor_id?.specialization || ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}
