import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave'; 
import './App.css';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <h2>Company Portal</h2>
        <div>
          <Link to="/">Dashboard</Link>
          <Link to="/apply">Apply for Leave</Link> 
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/apply" element={<ApplyLeave />} />
      </Routes>
    </Router>
  );
}

export default App;