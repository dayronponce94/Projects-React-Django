import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';
import DoctorSchedulePage from './pages/DoctorSchedulePage';
import DoctorSearchPage from './pages/DoctorSearchPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageSchedulePage from './pages/ManageSchedulePage';


// Component to protect routes
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/doctors" element={<DoctorSearchPage />} />
              <Route path="/doctor/:doctorId/schedule" element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <DoctorSchedulePage />
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <PatientAppointmentsPage />
                </ProtectedRoute>
              } />
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/manage-schedule" element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <ManageSchedulePage />
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <footer className="bg-gray-100 py-4 text-center">
            <p>© {new Date().getFullYear()} ClinicApp. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;