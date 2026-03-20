import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import AdminDashboard from './pages/AdminDashboard'; 
import ApplyLeave from './pages/ApplyLeave';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/*employee route*/}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/*admin route*/}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        <Route path="/apply-leave" element={<ApplyLeave />} />
      </Routes>
    </Router>
  );
}

export default App;