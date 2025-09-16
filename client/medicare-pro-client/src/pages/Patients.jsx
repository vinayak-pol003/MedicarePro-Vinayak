import { useEffect, useState, useContext, Fragment } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext.jsx";
import FadeInSection from "../utils/Fade";

// Patient Profile Expansion Component (keeping the same as before)
function PatientProfileExpansion({ patient, onClose, onSave, loading, error }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
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
      alert('Failed to save patient details');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: patient?.name || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      description: patient?.description || ''
    });
    setEditMode(false);
  };

  const handleEdit = () => {
    setFormData({
      name: patient?.name || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      description: patient?.description || ''
    });
    setEditMode(true);
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

  return (
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6 rounded-lg shadow-lg animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
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
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg text-sm">
                    {patient?.email || 'Not provided'}
                  </p>
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

              {/* Doctor Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Doctor</label>
                <p className="text-gray-800 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 text-sm">
                  {patient?.doctor_id?.name || 'Not assigned'}
                  {patient?.doctor_id?.specialization && (
                    <span className="text-blue-600 text-xs block">
                      {patient.doctor_id.specialization}
                    </span>
                  )}
                </p>
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
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                >
                  Edit Patient
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Patients() {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
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
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await axios.get("http://localhost:5000/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load patients.");
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [navigate]);

  // Fetch individual patient details and toggle expansion
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
      const res = await axios.get(`http://localhost:5000/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPatient(res.data);
    } catch (err) {
      setPatientError("Error loading patient details.");
    } finally {
      setPatientLoading(false);
    }
  };

  // Save patient changes
  const savePatientChanges = async (patientId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/patients/${patientId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPatients(prev => prev.map(p => 
        p._id === patientId ? { ...p, ...updatedData } : p
      ));

      setSelectedPatient(prev => ({ ...prev, ...updatedData }));
      
      alert("Patient updated successfully!");
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

  // Filter patients for doctor-only view
  const visiblePatients = user?.role === "doctor"
    ? patients.filter(patient => {
        const patientDoctorEmail = patient.doctor_id?.email;
        const currentUserEmail = user.email;
        return patientDoctorEmail === currentUserEmail;
      })
    : patients;

  const handleDelete = async (id) => {
    const patient = patients.find(p => p._id === id);
    const patientName = patient?.name || "this patient";
    
    const confirmMessage = `Are you sure you want to delete ${patientName}?\n\nThis will also delete all appointments associated with this patient.`;
    if (!window.confirm(confirmMessage)) return;
    
    if (user?.role === "doctor") {
      const patientDoctorEmail = patient?.doctor_id?.email;
      
      if (patientDoctorEmail !== user.email) {
        alert("You can only delete your own patients");
        return;
      }
    }
    
    try {
      const token = localStorage.getItem("token");
      
      const appointmentsRes = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const patientAppointments = appointmentsRes.data.filter(
        appointment => String(appointment.patient_id?._id || appointment.patient_id) === String(id)
      );
      
      const deleteAppointmentPromises = patientAppointments.map(appointment =>
        axios.delete(`http://localhost:5000/api/appointments/${appointment._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      
      await Promise.all(deleteAppointmentPromises);
      
      await axios.delete(`http://localhost:5000/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setPatients((prev) => prev.filter((p) => p._id !== id));
      
      if (expandedPatientId === id) {
        closePatientExpansion();
      }
      
      alert(`Successfully deleted ${patientName} and ${patientAppointments.length} associated appointments.`);
      
    } catch (err) {
      console.error("Error deleting patient and appointments:", err);
      alert(`Failed to delete patient. Error: ${err.response?.data?.message || err.message}`);
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
                    ? "Manage and track your patients" 
                    : "Manage and track all patients"}
                </p>
              </div>
              <Link to="/addpatient" className="w-full sm:w-auto mt-2 sm:mt-0">
                <button className="bg-cyan-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors w-full sm:w-auto">
                  Add Patient
                </button>
              </Link>
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

        {/* Patient Cards - Simplified Design */}
        <div className="space-y-3">
          {filteredPatients.length === 0 && (
            <div className="text-gray-400 text-center py-6">
              {user?.role === "doctor" 
                ? `No patients found. ${filter || statusFilter ? "Try adjusting your search criteria." : "You have no patients assigned to you."}`
                : "No patients found."}
            </div>
          )}
          
          {filteredPatients.map((p) => (
            <Fragment key={p._id}>
              {/* Simple Patient Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-cyan-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  {/* Square Patient Image */}
                  <div className="w-16 h-16 bg-gray-100 border border-gray-200 overflow-hidden">
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

                  {/* Patient Info - Right of Image */}
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

                  {/* Action Buttons */}
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
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 border border-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Patient Profile */}
              {expandedPatientId === p._id && (
                <div className="ml-4 mr-4 mb-2">
                  <PatientProfileExpansion
                    patient={selectedPatient}
                    loading={patientLoading}
                    error={patientError}
                    onClose={closePatientExpansion}
                    onSave={savePatientChanges}
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
