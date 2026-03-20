import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  //false = employee Login/ true = admin Login
  const [isAdminPanelActive, setIsAdminPanelActive] = useState(false);
  const navigate = useNavigate();

  const handleEmployeeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Employee login triggered!");
    //later connect backend role employee
    navigate('/dashboard'); 
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Admin login triggered!");
    //later connect backend role admin
    navigate('/dashboard'); 
  };

  return (
    <div className="login-page-container">
      {/* We reuse the 'right-panel-active' CSS class to trigger the slide */}
      <div className={`sliding-container ${isAdminPanelActive ? 'right-panel-active' : ''}`}>
        
        {/* admin login form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleAdminLogin}>
            <h1>Admin Portal</h1>
            <span>Leave Management System</span>
            <input type="email" placeholder="Admin Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Admin Sign In</button>
          </form>
        </div>

        {/* employee login form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleEmployeeLogin}>
            <h1>Employee Portal</h1>
            <span>Leave Management System</span>
            <input type="email" placeholder="Work Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Employee Sign In</button>
          </form>
        </div>

        {/* purple overlay sildes back, forth */}
        <div className="overlay-container">
          <div className="overlay">
            
            {/* admin puple text */}
            <div className="overlay-panel overlay-left">
              <h1>Are you an Employee?</h1>
              <p>Click below to access your personal dashboard and apply for leave.</p>
              <button 
                type="button" 
                className="ghost" 
                onClick={() => setIsAdminPanelActive(false)}
              >
                Employee Login
              </button>
            </div>

            {/* emplyee purple text*/}
            <div className="overlay-panel overlay-right">
              <h1>Are you an Admin?</h1>
              <p>Click below to manage employee records and review leave requests.</p>
              <button 
                type="button" 
                className="ghost" 
                onClick={() => setIsAdminPanelActive(true)}
              >
                Admin Login
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;