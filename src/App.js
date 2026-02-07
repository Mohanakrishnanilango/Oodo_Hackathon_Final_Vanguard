import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import ForgetPassword from './ForgetPassword';
import InternalUserDashboard from './InternalUserDashboard';
import Home from './Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/internal-dashboard" element={<InternalUserDashboard />} />
          <Route path="/" element={<Home />} />
          {/* Redirect any unknown route to login, or home if you prefer */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
