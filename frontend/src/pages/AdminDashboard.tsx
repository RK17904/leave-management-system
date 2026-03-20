import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LeaveRequest {
  ID: number;
  EmployeeName: string;
  LeaveType: string;
  StartDate: string;
  EndDate: string;
  Reason: string;
  Status: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  //switching tabs between requests, register
  const [activeTab, setActiveTab] = useState<'requests' | 'register'>('requests');
  
  //state for Leave Requests
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  //state for Registering a User
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('employee');
  const [registerMessage, setRegisterMessage] = useState('');

  //fetch Data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    //cick out users
    if (!token || role !== 'admin') {
      navigate('/');
      return;
    }

    fetchLeaves(token);
  }, [navigate]);

  const fetchLeaves = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:8080/api/leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setLoading(false);
    }
  };

  //handel approve/ reject
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/leaves/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      //update UI
      setLeaves(leaves.map(leave => leave.ID === id ? { ...leave, Status: newStatus } : leave));
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  //register new user
  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterMessage('');
    try {
      await axios.post('http://localhost:8080/api/register', {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole
      });
      setRegisterMessage("User successfully registered!");
      //clear form
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
    } catch (error: any) {
      setRegisterMessage(error.response?.data?.error || "Registration failed.");
    }
  };

  //helper functions
  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <div className="admin-layout">
      {/*navbar*/}
      <header className="admin-navbar">
        <div className="logo">
          <span style={{ fontSize: '24px' }}>🟣</span> Leave Management
        </div>
        <div className="user-profile">
          <span>Admin Portal</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/*horizontal tabs*/}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Leave Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Add Employee
        </button>
      </div>

      {/*main content area*/}
      <main className="admin-content">
        
        {/*leave requests table*/}
        {activeTab === 'requests' && (
          <div className="modern-card">
            <h3>Company Leave Requests</h3>
            {loading ? <p>Loading records...</p> : (
              <table className="leave-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.ID}>
                      <td>{leave.EmployeeName || "Employee"}</td> 
                      <td>{leave.LeaveType || "Sick"}</td>
                      <td>{new Date(leave.StartDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.EndDate).toLocaleDateString()}</td>
                      <td>{leave.Reason}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(leave.Status)}`}>
                          {leave.Status}
                        </span>
                      </td>
                      <td>
                        {leave.Status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleUpdateStatus(leave.ID, 'Approved')} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Approve</button>
                            <button onClick={() => handleUpdateStatus(leave.ID, 'Rejected')} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Reject</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* register employee form */}
        {activeTab === 'register' && (
          <div className="modern-card">
            <h3>Register New User</h3>
            <form onSubmit={handleRegisterUser} className="register-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="e.g. John Doe" />
              </div>
              <div className="form-group">
                <label>Work Email</label>
                <input type="email" required value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="john@company.com" />
              </div>
              <div className="form-group">
                <label>Temporary Password</label>
                <input type="password" required value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="Enter a secure password" />
              </div>
              <div className="form-group">
                <label>Account Role</label>
                <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin / HR</option>
                </select>
              </div>
              
              {/*message after register*/}
              {registerMessage && (
                <p className="form-message" style={{ color: registerMessage.includes("success") ? 'green' : 'red', fontSize: '14px', margin: '0' }}>
                  {registerMessage}
                </p>
              )}
              
              <button type="submit" className="submit-btn">Create Account</button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;