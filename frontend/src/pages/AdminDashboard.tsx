import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//interfaces 
//optional fields to prevent crashes
interface LeaveRequest {
  ID?: number; id?: number;
  EmployeeName?: string; employeeName?: string;
  LeaveType?: string; leaveType?: string;
  StartDate?: string; startDate?: string;
  EndDate?: string; endDate?: string;
  Reason?: string; reason?: string;
  Status?: string; status?: string;
}

interface User {
  ID?: number; id?: number;
  Name?: string; name?: string;
  Email?: string; email?: string;
  Role?: string; role?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'register' | 'manage'>('requests');
  
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('employee');
  const [registerMessage, setRegisterMessage] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [manageMessage, setManageMessage] = useState('');

  //authentication & data fetching
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      navigate('/');
      return;
    }

    if (activeTab === 'requests') {
      fetchLeaves(token);
    } else if (activeTab === 'manage') {
      fetchUsers(token);
    }
  }, [navigate, activeTab]);

  const fetchLeaves = async (token: string) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const leaveData = response.data.data || response.data || [];
      setLeaves(Array.isArray(leaveData) ? leaveData : []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (token: string) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = response.data.data || response.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  //action handlers
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/leaves/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setLeaves(leaves.map(leave => (leave.ID === id || leave.id === id) ? { ...leave, Status: newStatus, status: newStatus } : leave));
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterMessage('');
    try {
      await axios.post('http://localhost:8080/api/register', {
        name: newUserName, email: newUserEmail, password: newUserPassword, role: newUserRole
      });
      setRegisterMessage("User successfully registered!");
      setNewUserName(''); setNewUserEmail(''); setNewUserPassword('');
    } catch (error: any) {
      setRegisterMessage(error.response?.data?.error || "Registration failed.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user.ID !== id && user.id !== id));
      setManageMessage("User deleted successfully.");
    } catch (error) {
      setManageMessage("Failed to delete user.");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const targetId = editingUser.ID || editingUser.id;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/users/${targetId}`, 
        { name: editingUser.Name || editingUser.name, email: editingUser.Email || editingUser.email, role: editingUser.Role || editingUser.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => (u.ID === targetId || u.id === targetId) ? editingUser : u));
      setEditingUser(null);
      setManageMessage("User updated successfully!");
    } catch (error) {
      setManageMessage("Failed to update user.");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  //UI helpers
  const getStatusClass = (status?: string) => {
    const safeStatus = (status || 'pending').toLowerCase();
    switch (safeStatus) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const safeDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const LoadingSpinner = () => (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Fetching Data...</p>
    </div>
  );

  //filter users into admins and employees
  const adminsList = users.filter(u => (u.Role || u.role || '').toLowerCase() === 'admin');
  const employeesList = users.filter(u => (u.Role || u.role || '').toLowerCase() === 'employee');

  //employee table 
  const renderUserTable = (userList: User[]) => (
    <table className="leave-table" style={{ tableLayout: 'fixed', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ width: '10%' }}>ID</th>
          <th style={{ width: '30%' }}>Name</th>
          <th style={{ width: '40%' }}>Email</th>
          <th style={{ width: '20%' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {userList.map((user, index) => {
          const id = user.ID || user.id || index;
          return (
            <tr key={id}>
              <td>{id}</td>
              <td>{user.Name || user.name || "Unknown"}</td>
              <td>{user.Email || user.email || "No Email"}</td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setEditingUser(user)} style={{ background: '#3182ce', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                  <button onClick={() => handleDeleteUser(id)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                </div>
              </td>
            </tr>
          );
        })}
        {userList.length === 0 && <tr><td colSpan={4} style={{textAlign: 'center', padding: '15px'}}>No records found.</td></tr>}
      </tbody>
    </table>
  );

  return (
    <div className="admin-layout">
      <header className="admin-navbar">
        <div className="logo"><span style={{ fontSize: '24px' }}>🟣</span> Leave Management</div>
        <div className="user-profile">
          <span>Admin Portal</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Leave Requests</button>
        <button className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Add Employee</button>
        <button className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>Manage Employees</button>
      </div>

      <main className="admin-content">
        <div key={activeTab} className="animated-tab-content">
          
          {/*leave requests*/}
          {activeTab === 'requests' && (
            <div className="modern-card">
              <h3>Company Leave Requests</h3>
              {loading ? <LoadingSpinner /> : (
                <table className="leave-table">
                  <thead><tr><th>Employee Name</th><th>Type</th><th>Start Date</th><th>End Date</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {leaves.map((leave, index) => {
                      const id = leave.ID || leave.id || index;
                      const status = leave.Status || leave.status || "Pending";
                      return (
                        <tr key={id}>
                          <td>{leave.EmployeeName || leave.employeeName || "Unknown"}</td> 
                          <td>{leave.LeaveType || leave.leaveType || "Other"}</td>
                          <td>{safeDate(leave.StartDate || leave.startDate)}</td>
                          <td>{safeDate(leave.EndDate || leave.endDate)}</td>
                          <td>{leave.Reason || leave.reason || "None"}</td>
                          <td><span className={`status-badge ${getStatusClass(status)}`}>{status}</span></td>
                          <td>
                            {status.toLowerCase() === 'pending' ? (
                              <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => handleUpdateStatus(id, 'Approved')} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Approve</button>
                                <button onClick={() => handleUpdateStatus(id, 'Rejected')} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Reject</button>
                              </div>
                            ) : <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Resolved</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/*register employees*/}
          {activeTab === 'register' && (
            <div className="modern-card">
              <h3>Register New User</h3>
              <form onSubmit={handleRegisterUser} className="register-form">
                <div className="form-group"><label>Full Name</label><input type="text" required value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="e.g. John Doe" /></div>
                <div className="form-group"><label>Work Email</label><input type="email" required value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="john@company.com" /></div>
                <div className="form-group"><label>Temporary Password</label><input type="password" required value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="Enter a secure password" /></div>
                <div className="form-group">
                  <label>Account Role</label>
                  <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                    <option value="employee">Employee</option><option value="admin">Admin / HR</option>
                  </select>
                </div>
                {registerMessage && <p className="form-message" style={{ color: registerMessage.includes("success") ? 'green' : 'red', fontSize: '14px', margin: '0' }}>{registerMessage}</p>}
                <button type="submit" className="submit-btn">Create Account</button>
              </form>
            </div>
          )}

          {/*manage users*/}
          {activeTab === 'manage' && (
            <div className="modern-card">
              <h3>Manage System Users</h3>
              {manageMessage && <p style={{ color: 'blue', marginBottom: '15px' }}>{manageMessage}</p>}
              
              {editingUser ? (
                <div style={{ padding: '20px', backgroundColor: '#f8f9fb', borderRadius: '8px', marginBottom: '20px' }}>
                  <h4>Edit User</h4>
                  <form onSubmit={handleUpdateUser} className="register-form">
                    <div className="form-group"><label>Full Name</label><input type="text" required value={editingUser.Name || editingUser.name || ''} onChange={e => setEditingUser({...editingUser, Name: e.target.value, name: e.target.value})} /></div>
                    <div className="form-group"><label>Work Email</label><input type="email" required value={editingUser.Email || editingUser.email || ''} onChange={e => setEditingUser({...editingUser, Email: e.target.value, email: e.target.value})} /></div>
                    <div className="form-group">
                      <label>Account Role</label>
                      <select value={editingUser.Role || editingUser.role || 'employee'} onChange={e => setEditingUser({...editingUser, Role: e.target.value, role: e.target.value})}>
                        <option value="employee">Employee</option><option value="admin">Admin / HR</option>
                      </select>
                    </div>
                    <div className="form-message" style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="submit-btn">Save Changes</button>
                      <button type="button" onClick={() => setEditingUser(null)} style={{ background: '#718096', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>Cancel</button>
                    </div>
                  </form>
                </div>
              ) : (
                loading ? <LoadingSpinner /> : (
                  <>
                    <div className="role-header">
                    <strong>Administrators & HR</strong>
                    </div>
                    {renderUserTable(adminsList)}

                    <div className="role-header" style={{ marginTop: '40px' }}>
                    <strong>Standard Employees</strong>
                    </div>
                    {renderUserTable(employeesList)}
                  </>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;