import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import FadeInSection from "../utils/Fade";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete patient.");
    }
  };

  const filteredPatients = patients.filter((p) => {
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
        {/* ------- Header Section ------- */}
        <div className="bg-cyan-500 w-full p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-8 bg-cyan-500">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Patients</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage and track all patients</p>
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ------- Patient Cards ------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPatients.length === 0 && (
            <div className="col-span-4 text-gray-400 text-center py-6">
              No patients found.
            </div>
          )}
          {filteredPatients.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="relative h-32 sm:h-48 bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-lg">
                  {p.image ? (
                    <img
                      src={`http://localhost:5000${p.image}`}
                      alt={`${p.name} profile`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-lg">Patient Image</span>
                  )}
                </div>
              <div className="p-2 sm:p-4 flex-1 flex flex-col">
                <h2 className="text-base sm:text-lg font-semibold">{p.name}</h2>
                <p className="text-gray-500 text-xs sm:text-base">{p.email || "No email"}</p>
                <p className="text-gray-500 text-xs sm:text-base">{p.phone || "No phone"}</p>
                <p className="text-gray-400 mt-2 text-xs sm:text-base">
                  Doctor: {p.doctor_id?.name || "-"}
                </p>
                {p.doctor_id?.specialization && (
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Specialization: {p.doctor_id.specialization}
                  </p>
                )}
                {p.description && (
                  <p className="text-gray-400 mt-1 text-xs sm:text-sm">{p.description}</p>
                )}
                <div className="flex items-center justify-between mt-4">
                  <Link
                    to={`/appointments/${p._id}`}
                    className="text-[#1897c6] font-semibold hover:underline text-xs sm:text-sm"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-50 text-red-700 px-2 sm:px-3 py-1 rounded-lg hover:bg-red-100 text-xs font-semibold border border-red-200 transition ml-2 sm:ml-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
