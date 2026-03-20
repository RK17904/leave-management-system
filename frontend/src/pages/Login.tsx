import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isAdminPanelActive, setIsAdminPanelActive] = useState(false);
  const navigate = useNavigate();

  //form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  //pass the expectedRole to verify
  const handleLoginSubmit = async (e: React.FormEvent, expectedRole: string) => {
    e.preventDefault();
    setErrorMessage(''); //Clear old errors

    try {
      //send credential to backend
      const response = await axios.post('http://localhost:8080/api/login', {
        email: email,
        password: password
      });

      //extract the data go sends back
      const { token, user } = response.data;

      //chreck the employee tries to log  as admin 
      if (user.role !== expectedRole) {
        setErrorMessage(`Access Denied: You are not registered as an ${expectedRole}.`);
        return;
      }

      //success and save the JWT token and user details in the browser's vault
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));

      //redirect to correct dashbaord
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (error: any) {
      //400 or 401 error (wrong password, user not found)
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || "Invalid login credentials.");
      } else {
        setErrorMessage("Server error. Is your Go backend running?");
      }
    }
  };

  //helper to switch panels and clear out typed text/errors
  const togglePanel = (isAdmin: boolean) => {
    setIsAdminPanelActive(isAdmin);
    setEmail('');
    setPassword('');
    setErrorMessage('');
  };

  return (
    <div className="login-page-container">
      <div className={`sliding-container ${isAdminPanelActive ? 'right-panel-active' : ''}`}>
        
        {/*admin login form*/}
        <div className="form-container sign-up-container">
          <form onSubmit={(e) => handleLoginSubmit(e, 'admin')}>
            <h1>Admin Portal</h1>
            <span>Leave Management System</span>
            
            <input type="email" placeholder="Admin Email" required 
                   value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required 
                   value={password} onChange={(e) => setPassword(e.target.value)} />
            
            {/*login filed errors*/}
            {errorMessage && <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>{errorMessage}</p>}
            
            <button type="submit">Admin Sign In</button>
          </form>
        </div>

        {/*employee login form */}
        <div className="form-container sign-in-container">
          <form onSubmit={(e) => handleLoginSubmit(e, 'employee')}>
            <h1>Employee Portal</h1>
            <span>Leave Management System</span>
            
            <input type="email" placeholder="Work Email" required 
                   value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required 
                   value={password} onChange={(e) => setPassword(e.target.value)} />
            
            {/* login filed errors*/}
            {errorMessage && <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>{errorMessage}</p>}
            
            <button type="submit">Employee Sign In</button>
          </form>
        </div>

        {/*purple overlay*/}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Are you an Employee?</h1>
              <p>Click below to access your personal dashboard and apply for leave.</p>
              <button type="button" className="ghost" onClick={() => togglePanel(false)}>
                Employee Login
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Are you an Admin?</h1>
              <p>Click below to manage employee records and review leave requests.</p>
              <button type="button" className="ghost" onClick={() => togglePanel(true)}>
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