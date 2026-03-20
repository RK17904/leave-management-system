import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LeaveRequest {
  ID?: number; id?: number;
  EmployeeName?: string; employeeName?: string;
  LeaveType?: string; leaveType?: string;
  StartDate?: string; startDate?: string;
  EndDate?: string; endDate?: string;
  Reason?: string; reason?: string;
  Status?: string; status?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my-leaves' | 'apply' | 'calendar'>('my-leaves');
  
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  //apply leave fron state
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [formMessage, setFormMessage] = useState('');

  //calendar navigation
  const [calendarDate, setCalendarDate] = useState(new Date());

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  //apply logic
  
  //lock past dates
  const getLocalTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split('T')[0];
  };
  const todayStr = getLocalTodayString();

  //automatical pushes the end date when sart date chages 
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (endDate && new Date(endDate) < new Date(newStart)) {
      setEndDate(newStart);
    }
  };

  //calculate total days 
  const getLeaveDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  //data fetching
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      navigate('/');
      return;
    }
    if (role === 'admin') {
      navigate('/admin-dashboard');
      return;
    }

    fetchMyLeaves(token);
  }, [navigate]);

  const fetchMyLeaves = async (token: string) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const leaveData = response.data.data || response.data || [];
      const myLeaves = Array.isArray(leaveData) ? leaveData.filter(l => 
        (l.EmployeeName || l.employeeName) === (user?.name || user?.Name)
      ) : [];
      setLeaves(myLeaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage('');
    
    //custom validation for days 
    if (new Date(endDate) < new Date(startDate)) {
      setFormMessage("Error: End Date cannot be before Start Date.");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/leaves', {
        employeeName: user?.name || user?.Name || "Employee",
        leaveType: leaveType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        reason: reason,
        status: "Pending"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormMessage("Leave application submitted successfully!");
      setLeaveType('Annual'); setStartDate(''); setEndDate(''); setReason('');
      fetchMyLeaves(token!);
      
      //read the success message
      //then pass  to history
      setTimeout(() => setActiveTab('my-leaves'), 1500); //1.5 seconds

    } catch (error: any) {
      setFormMessage(error.response?.data?.error || "Failed to submit leave request.");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  //UI helpers
  
  const safeDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusClass = (status?: string) => {
    const safeStatus = (status || 'pending').toLowerCase();
    switch (safeStatus) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getTypeClass = (type?: string) => {
    const safeType = (type || '').toLowerCase();
    if (safeType.includes('sick')) return 'type-sick';
    if (safeType.includes('casual')) return 'type-casual';
    return 'type-annual'; 
  };

  const LoadingSpinner = () => (
    <div className="spinner-container">
      <div className="spinner"></div><p>Fetching Your Data...</p>
    </div>
  );

  //calculate leave stats
  const calculateStats = () => {
    let annual = 0, sick = 0, casual = 0;
    
    leaves.forEach(l => {
      if ((l.Status || l.status)?.toLowerCase() === 'rejected') return; 
      
      const start = new Date(l.StartDate || l.startDate || new Date());
      const end = new Date(l.EndDate || l.endDate || new Date());
      
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const type = (l.LeaveType || l.leaveType || '').toLowerCase();
      if (type.includes('annual')) annual += diffDays;
      else if (type.includes('sick')) sick += diffDays;
      else if (type.includes('casual')) casual += diffDays;
    });
    
    return { annual, sick, casual };
  };
  const stats = calculateStats();

  //calendar navigation render
  const today = new Date();
  const minMonth = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);

  const canGoPrev = calendarDate > minMonth;
  const canGoNext = calendarDate < maxMonth;

  const handlePrevMonth = () => {
    if (canGoPrev) setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    if (canGoNext) setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const currentMonth = calendarDate.getMonth();
    const currentYear = calendarDate.getFullYear();
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarBoxes = [];
    
    //empty boxes
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarBoxes.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    //actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      
      const leavesOnThisDay = leaves.filter(leave => {
        if (!leave.StartDate && !leave.startDate) return false;
        if (!leave.EndDate && !leave.endDate) return false;
        
        const start = new Date((leave.StartDate || leave.startDate)!);
        start.setHours(0,0,0,0);
        const end = new Date((leave.EndDate || leave.endDate)!);
        end.setHours(23,59,59,999);
        
        return currentDate >= start && currentDate <= end;
      });

      calendarBoxes.push(
        <div key={`day-${day}`} className="calendar-day">
          <span className="day-number">{day}</span>
          {leavesOnThisDay.map((l, index) => {
            const status = (l.Status || l.status || '').toLowerCase();
            if (status === 'rejected') return null; 
            
            return (
              <div key={index} className={`leave-pill ${getTypeClass(l.LeaveType || l.leaveType)}`}>
                {l.LeaveType || l.leaveType} {status === 'pending' ? '⏳' : ''}
              </div>
            );
          })}
        </div>
      );
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
      <div className="calendar-container">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={handlePrevMonth} disabled={!canGoPrev}>
            &larr; Previous
          </button>
          <h3 style={{ margin: 0, color: '#2d3748' }}>
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button className="nav-btn" onClick={handleNextMonth} disabled={!canGoNext}>
            Next &rarr;
          </button>
        </div>

        <div className="calendar-header-row">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="calendar-grid">
          {calendarBoxes}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-layout">
      <header className="admin-navbar">
        <div className="logo"><span style={{ fontSize: '24px' }}>🟣</span> Leave Management</div>
        <div className="user-profile">
          <span>Employee Portal: {user?.name || user?.Name || 'User'}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'my-leaves' ? 'active' : ''}`} onClick={() => setActiveTab('my-leaves')}>My Leave History</button>
        <button className={`tab-btn ${activeTab === 'apply' ? 'active' : ''}`} onClick={() => setActiveTab('apply')}>Apply for Leave</button>
        <button className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>Leave Calendar</button>
      </div>

      <main className="admin-content">
        <div key={activeTab} className="animated-tab-content">
          
          {/*user leaves*/}
          {activeTab === 'my-leaves' && (
            <div className="modern-card">
              <h3>My Leave History</h3>
              {loading ? <LoadingSpinner /> : (
                <table className="leave-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Type</th>
                      <th style={{ width: '20%' }}>Start Date</th>
                      <th style={{ width: '20%' }}>End Date</th>
                      <th style={{ width: '25%' }}>Reason</th>
                      <th style={{ width: '15%' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave, index) => {
                      const id = leave.ID || leave.id || index;
                      const status = leave.Status || leave.status || "Pending";
                      const type = leave.LeaveType || leave.leaveType || "Other";
                      return (
                        <tr key={id}>
                          <td><span className={`leave-pill ${getTypeClass(type)}`} style={{ display: 'inline-block', width: 'auto', padding: '4px 12px' }}>{type}</span></td>
                          <td>{safeDate(leave.StartDate || leave.startDate)}</td>
                          <td>{safeDate(leave.EndDate || leave.endDate)}</td>
                          <td>{leave.Reason || leave.reason || "None"}</td>
                          <td><span className={`status-badge ${getStatusClass(status)}`}>{status}</span></td>
                        </tr>
                      );
                    })}
                    {leaves.length === 0 && <tr><td colSpan={5} style={{textAlign: 'center', padding: '15px'}}>You have no leave history.</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/*apply for leaves */}
          {activeTab === 'apply' && (
            <div className="modern-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Apply for Leave</h3>
                
                {/*live duration badges*/}
                {startDate && endDate && getLeaveDuration() > 0 && (
                  <span style={{ backgroundColor: '#e9d8fd', color: '#553c9a', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                    Total Duration: {getLeaveDuration()} Day(s)
                  </span>
                )}
              </div>

              <form onSubmit={handleApplyLeave} className="register-form">
                <div className="form-group">
                  <label>Leave Type</label>
                  <select value={leaveType} onChange={e => setLeaveType(e.target.value)} required>
                    <option value="Annual">Annual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Casual">Casual Leave</option>
                  </select>
                </div>
                <div className="form-group"></div> 

                <div className="form-group">
                  <label>Start Date</label>
                  {/*min={todayStr} strictly locks past dates based on local timezone */}
                  <input type="date" min={todayStr} required value={startDate} onChange={handleStartDateChange} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  {/*dynamically updates its minimum based on what the Start Date is */}
                  <input type="date" min={startDate || todayStr} required value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>

                <div className="form-group form-message">
                  <label>Reason for Leave</label>
                  <textarea 
                    required 
                    value={reason} 
                    onChange={e => setReason(e.target.value)} 
                    placeholder="Briefly explain your reason..."
                    style={{ padding: '12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontFamily: 'inherit', resize: 'vertical', minHeight: '80px' }}
                  />
                </div>

                {formMessage && <p className="form-message" style={{ color: formMessage.includes("success") ? 'green' : 'red', fontSize: '14px', margin: '0' }}>{formMessage}</p>}
                
                <button type="submit" className="submit-btn form-message">Submit Request</button>
              </form>
            </div>
          )}

          {/*calendar view */}
          {activeTab === 'calendar' && (
            <>
              {/*top sata cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Total Annual Taken</h4>
                  <span className="stat-value type-annual" style={{ background: 'transparent' }}>{stats.annual} Days</span>
                </div>
                <div className="stat-card">
                  <h4>Total Sick Taken</h4>
                  <span className="stat-value type-sick" style={{ background: 'transparent' }}>{stats.sick} Days</span>
                </div>
                <div className="stat-card">
                  <h4>Total Casual Taken</h4>
                  <span className="stat-value type-casual" style={{ background: 'transparent' }}>{stats.casual} Days</span>
                </div>
              </div>

              <div className="modern-card">
                {loading ? <LoadingSpinner /> : renderCalendar()}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;