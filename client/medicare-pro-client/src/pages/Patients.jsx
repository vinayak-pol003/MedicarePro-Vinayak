import { useEffect, useState, useContext, Fragment } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

// Patient Profile Expansion Component with role-based edit access
// Patient Profile Expansion Component with role-based edit access
function PatientProfileExpansion({ patient, onClose, onSave, loading, error, userRole, appointments }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        phone: patient.phone || '',
        description: patient.description || ''
      });
    }
  }, [patient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(patient._id, formData);
      setEditMode(false);
    } catch (err) {
      console.error('Error saving patient:', err);
      toast.error('Failed to save patient details');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: patient?.name || '',
      phone: patient?.phone || '',
      description: patient?.description || ''
    });
    setEditMode(false);
  };

  const handleEdit = () => {
    setFormData({
      name: patient?.name || '',
      phone: patient?.phone || '',
      description: patient?.description || ''
    });
    setEditMode(true);
  };

  // Get unique doctors from appointments
  const getAssociatedDoctors = () => {
    if (!appointments || !patient) return [];
    
    const patientAppointments = appointments.filter(apt => 
      String(apt.patient_id?._id || apt.patient_id) === String(patient._id)
    );

    const doctorMap = new Map();

    // Add directly assigned doctor
    if (patient.doctor_id) {
      doctorMap.set(patient.doctor_id._id, {
        ...patient.doctor_id,
        assignmentType: 'direct'
      });
    }

    // Add doctors from appointments
    patientAppointments.forEach(apt => {
      if (apt.doctor_id && apt.doctor_id._id) {
        if (!doctorMap.has(apt.doctor_id._id)) {
          doctorMap.set(apt.doctor_id._id, {
            ...apt.doctor_id,
            assignmentType: 'appointment'
          });
        } else {
          const existing = doctorMap.get(apt.doctor_id._id);
          if (existing.assignmentType !== 'direct') {
            existing.assignmentType = 'appointment';
          }
        }
      }
    });

    return Array.from(doctorMap.values());
  };

  // Get patient's recent appointments
  const getRecentAppointments = () => {
    if (!appointments || !patient) return [];
    
    const patientAppointments = appointments.filter(apt => 
      String(apt.patient_id?._id || apt.patient_id) === String(patient._id)
    );

    return patientAppointments
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6 rounded-lg shadow-lg animate-fadeIn">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-cyan-200 border-t-cyan-600"></div>
          <span className="ml-3 text-gray-600">Loading patient details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-red-600 flex items-center">
            <span className="mr-2">⚠️</span>
            Error Loading Patient
          </h3>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 text-2xl leading-none">×</button>
        </div>
        <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const associatedDoctors = getAssociatedDoctors();
  const recentAppointments = getRecentAppointments();

  return (
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6 rounded-lg shadow-lg animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-cyan-700 flex items-center">
          <span className="mr-2">👤</span>
          Patient Profile Details
        </h3>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Patient Info Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Patient Image */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-cyan-100 shadow-lg">
            {patient?.image ? (
              <img
                src={patient.image}
                alt={patient.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-2xl">👤</span>
              </div>
            )}
          </div>
          <h4 className="font-bold text-lg text-gray-800">{patient?.name}</h4>
          <p className="text-cyan-600 text-sm">Patient</p>
        </div>

        {/* Patient Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    required
                  />
                ) : (
                  <p className="text-gray-800 font-medium bg-gray-50 px-3 py-2 rounded-lg text-sm">
                    {patient?.name || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-800 bg-gray-100 px-3 py-2 rounded-lg text-sm border border-gray-200">
                  {patient?.email || 'Not provided'}
                </p>
              </div>

              {/* Associated Doctors Field - NEW POSITION */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Associated Doctors ({associatedDoctors.length})</label>
                {associatedDoctors.length === 0 ? (
                  <div className="text-center py-3 text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-200">
                    No doctors assigned
                  </div>
                ) : (
                  <div className="space-y-2">
                    {associatedDoctors.map((doctor, index) => (
                      <div key={doctor._id || index} className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800 text-sm">{doctor.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              doctor.assignmentType === 'direct' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                              {doctor.assignmentType === 'direct' ? 'Primary' : 'Appointment'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{doctor.specialization || 'General'}</p>
                        </div>
                        {doctor.consultation_fee && (
                          <div className="text-right">
                            <p className="text-xs font-semibold text-gray-700">₹{doctor.consultation_fee}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {editMode ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg text-sm">
                    {patient?.phone || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Description Field - Full Width */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                {editMode ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    placeholder="Patient description or notes..."
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg min-h-[3rem] text-sm">
                    {patient?.description || 'No description provided'}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.name.trim()}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                userRole === "admin" && (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                  >
                    Edit Patient
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments Section - Below Profile */}
      {/* Recent Appointments Section - Compact Design */}
<div className="bg-white rounded-lg p-4 shadow-sm">
  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
    <svg className="w-4 h-4 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    Recent Appointments ({recentAppointments.length})
  </h4>

  {recentAppointments.length === 0 ? (
    <div className="text-center py-3 text-gray-500 text-xs bg-gray-50 rounded-lg border border-gray-200">
      No appointments found
    </div>
  ) : (
    <div className="space-y-2">
      {recentAppointments.map((apt) => (
        <div key={apt._id} className="flex items-center justify-between p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:border-green-200 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h5 className="font-semibold text-gray-800 text-sm truncate">
                Dr. {apt.doctor_id?.name || 'Unknown'}
              </h5>
              <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${getStatusBadge(apt.status)}`}>
                {apt.status}
              </span>
            </div>
            <p className="text-xs text-gray-600 truncate">
              {apt.doctor_id?.specialization || 'General'}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(apt.date)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(apt.time)}
              </span>
              {apt.rating && (
                <span className="flex items-center gap-0.5">
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-600">{apt.rating}</span>
                </span>
              )}
            </div>
          </div>
          {apt.doctor_id?.consultation_fee && apt.status === 'completed' && (
            <div className="text-right ml-2 flex-shrink-0">
              <p className="text-xs font-semibold text-green-600">₹{apt.doctor_id.consultation_fee}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
}


export default function Patients() {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientError, setPatientError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [patientsRes, appointmentsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/patients`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/appointments`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setPatients(Array.isArray(patientsRes.data) ? patientsRes.data : []);
        setAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [navigate, user]);

  // Filter patients based on user role
  const visiblePatients = user?.role === "doctor"
    ? patients.filter(patient => {
        const patientDoctorEmail = patient.doctor_id?.email;
        const currentUserEmail = user.email;
        
        if (patientDoctorEmail === currentUserEmail) {
          return true;
        }
        
        const hasAppointmentWithDoctor = appointments.some(appointment => {
          const appointmentDoctorEmail = appointment.doctor_id?.email;
          const appointmentPatientId = String(appointment.patient_id?._id || appointment.patient_id);
          const currentPatientId = String(patient._id);
          
          return appointmentDoctorEmail === currentUserEmail && 
                 appointmentPatientId === currentPatientId;
        });
        
        return hasAppointmentWithDoctor;
      })
    : patients;

  const fetchPatientDetail = async (patientId) => {
    try {
      if (expandedPatientId === patientId) {
        setExpandedPatientId(null);
        setSelectedPatient(null);
        return;
      }

      setPatientLoading(true);
      setPatientError("");
      setSelectedPatient(null);
      setExpandedPatientId(patientId);

      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSelectedPatient(res.data);
    } catch (err) {
      console.error("Error fetching patient details:", err);
      
      if (err.response?.status === 403) {
        setPatientError("Access denied. You don't have permission to view this patient's details.");
      } else if (err.response?.status === 404) {
        setPatientError("Patient not found.");
      } else {
        setPatientError("Error loading patient details.");
      }
    } finally {
      setPatientLoading(false);
    }
  };

  const savePatientChanges = async (patientId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/patients/${patientId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPatients(prev => prev.map(p => 
        p._id === patientId ? { ...p, ...updatedData } : p
      ));

      setSelectedPatient(prev => ({ ...prev, ...updatedData }));
      
      toast.success("Patient updated successfully!");
    } catch (err) {
      console.error("Error updating patient:", err);
      throw new Error(err.response?.data?.message || "Failed to update patient");
    }
  };

  const closePatientExpansion = () => {
    setExpandedPatientId(null);
    setSelectedPatient(null);
    setPatientError("");
  };

  const handleDelete = async (id) => {
    const patient = patients.find(p => p._id === id);
    const patientName = patient?.name || "this patient";
    
    const confirmMessage = `Are you sure you want to delete ${patientName}?\n\nThis will also delete all appointments associated with this patient.`;
    if (!window.confirm(confirmMessage)) return;
    
    try {
      const token = localStorage.getItem("token");
      
      const patientAppointments = appointments.filter(
        appointment => String(appointment.patient_id?._id || appointment.patient_id) === String(id)
      );
      
      const deleteAppointmentPromises = patientAppointments.map(appointment =>
        axios.delete(`${BASE_URL}/api/appointments/${appointment._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      
      await Promise.all(deleteAppointmentPromises);
      
      await axios.delete(`${BASE_URL}/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setPatients((prev) => prev.filter((p) => p._id !== id));
      setAppointments((prev) => prev.filter((apt) => String(apt.patient_id?._id || apt.patient_id) !== String(id)));
      
      if (expandedPatientId === id) {
        closePatientExpansion();
      }
      
      toast.success(`Successfully deleted ${patientName} and ${patientAppointments.length} associated appointments.`);
      
    } catch (err) {
      console.error("Error deleting patient and appointments:", err);
      toast.error(`Failed to delete patient. Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const filteredPatients = visiblePatients.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(filter.toLowerCase()) ||
      p.email?.toLowerCase().includes(filter.toLowerCase()) ||
      p.doctor_id?.name?.toLowerCase().includes(filter.toLowerCase());

    const matchesStatus =
      statusFilter === ""
        ? true
        : statusFilter === "active"
        ? p.is_active
        : !p.is_active;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-6 mt-8 sm:mt-16 flex items-center justify-center h-48 sm:h-64">
        <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <FadeInSection>
      <div className="p-4 sm:p-6 mt-14 sm:mt-16 w-full">
        {/* Header Section */}
        <div className="bg-cyan-500 w-full p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-8 bg-cyan-500">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                  {user?.role === "doctor" ? "My Patients" : "Patients"}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {user?.role === "doctor" 
                    ? "Patients directly assigned to you and those with appointments" 
                    : "Manage and track all patients"}
                </p>
                {user?.role === "doctor" && (
                  <p className="text-gray-500 text-xs mt-1">
                    Showing {visiblePatients.length} patient(s)
                  </p>
                )}
              </div>
              {user?.role === "admin" && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link to="/addpatient" className="w-full sm:w-auto">
                    <button className="bg-cyan-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors w-full sm:w-auto">
                      Add Patient
                    </button>
                  </Link>
                  
                  <Link to="/patient-request" className="w-full sm:w-auto">
                    <button className="bg-cyan-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors w-full sm:w-auto">
                      Patient Requests
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-cyan-500 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Patients
                </label>
                <input
                  type="text"
                  placeholder={user?.role === "doctor" ? "Search by patient name or email..." : "Search by patient or doctor name..."}
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* No Patients Message */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 text-lg mb-2">👥</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Patients Found
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              {user?.role === "doctor" 
                ? filter || statusFilter 
                  ? "Try adjusting your search criteria."
                  : "You have no patients assigned to you or with appointments yet."
                : filter || statusFilter
                  ? "Try adjusting your search criteria."
                  : "No patients have been added to the system yet."}
            </p>
          </div>
        )}

        {/* Patient Cards */}
        <div className="space-y-3">
          {filteredPatients.map((p) => (
            <Fragment key={p._id}>
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-cyan-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 border border-gray-200 overflow-hidden rounded-lg">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={`${p.name} profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <span className="text-gray-400 text-xl">👤</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{p.name}</h3>
                    <p className="text-gray-600 text-sm">{p.email || "No email"}</p>
                    <p className="text-gray-600 text-sm">{p.phone || "No phone"}</p>
                    {user?.role !== "doctor" && (
                      <p className="text-gray-500 text-sm">
                        Doctor: {p.doctor_id?.name || "-"}
                        {p.doctor_id?.specialization && (
                          <span className="text-gray-400"> • {p.doctor_id.specialization}</span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchPatientDetail(p._id)}
                      className={`px-4 py-2 text-sm rounded transition-colors ${
                        expandedPatientId === p._id
                          ? 'bg-cyan-600 text-white'
                          : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
                      }`}
                    >
                      {expandedPatientId === p._id ? 'Hide ▲' : 'View ▼'}
                    </button>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 border border-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {expandedPatientId === p._id && (
                <div className="ml-4 mr-4 mb-2">
                  <PatientProfileExpansion
                    patient={selectedPatient}
                    loading={patientLoading}
                    error={patientError}
                    onClose={closePatientExpansion}
                    onSave={savePatientChanges}
                    userRole={user?.role}
                    appointments={appointments}
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
