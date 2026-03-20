import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const Dashboard = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>(''); //track who is logged in
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); //get role from vault
    
    if (!token) {
      navigate('/');
      return;
    }

    setUserRole(role || 'employee'); //save role to state

    const fetchLeaves = async () => {
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

    fetchLeaves();
  }, [navigate]);

  //leave approve, reject for admin
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      //call the put route
      await axios.put(`http://localhost:8080/api/leaves/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      //upadate the table
      setLeaves(leaves.map(leave => 
        leave.ID === id ? { ...leave, Status: newStatus } : leave
      ));
    } catch (error) {
      alert("Failed to update status. Is your Go server running?");
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2>Company Portal</h2>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          {/*show apply leave*/ }
          {userRole === 'employee' && <Link to="/apply-leave">Apply for Leave</Link>}
          <Link to="/" onClick={() => localStorage.clear()} style={{ color: '#e74c3c' }}>Logout</Link>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="table-card">
          <h3>{userRole === 'admin' ? 'Company Leave Requests' : 'My Leave History'}</h3>
          
          {loading ? (
            <p>Loading records...</p>
          ) : (
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  {/*action column for admins */}
                  {userRole === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.ID}>
                    <td>{leave.EmployeeName || "Employee"}</td> 
                    <td>{leave.LeaveType || "Sick"}</td>
                    <td>{formatDate(leave.StartDate)}</td>
                    <td>{formatDate(leave.EndDate)}</td>
                    <td>{leave.Reason}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(leave.Status)}`}>
                        {leave.Status}
                      </span>
                    </td>
                    {/*approve reject buttons for admins*/}
                    {userRole === 'admin' && (
                      <td>
                        {leave.Status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                              onClick={() => handleUpdateStatus(leave.ID, 'Approved')}
                              style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(leave.ID, 'Rejected')}
                              style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Resolved</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;