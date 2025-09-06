// src/pages/Admin.jsx
import Dashboard from "../pages/Dashboard.jsx";
import Appointments from "../pages/Appointments.jsx";
import Patients from "../pages/Patients.jsx";
import AddPatient from "../pages/AddPatients.jsx";
import Doctors from "../pages/Doctors.jsx";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-cyan-600">Admin Dashboard</h1>
      <p className="mt-2 text-gray-700">Welcome, Admin! Manage everything below 👇</p>

      {/* Show all components */}
      <div className="mt-6 space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">📊 Dashboard</h2>
          <Dashboard />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">📅 Appointments</h2>
          <Appointments />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">🧑‍🤝‍🧑 Patients</h2>
          <Patients />
          <AddPatient />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">👨‍⚕️ Doctors</h2>
          <Doctors />
        </section>
      </div>
    </div>
  );
}
