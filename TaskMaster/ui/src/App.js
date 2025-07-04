import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/tasks/Dashboard';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks" element={<Dashboard />} />
        </Routes>
        <Footer />
      </Container>
    </Router>
  );
}

export default App;