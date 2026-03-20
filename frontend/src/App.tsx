import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';

import './App.css'; //import css

function App() {
  return (
    <Router>
      <Routes>
        {/*default loading page */}
        <Route path="/" element={<Login />} />
        
        {/*after loging pages*/}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
      </Routes>
    </Router>
  );
}

export default App;