import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLeave, type Leave } from '../services/api';

export default function ApplyLeave() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Leave>({
    employee_name: '',
    leave_type: 'Annual',
    start_date: '',
    end_date: '',
    reason: '',
    status: 'Pending'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //date inputs return "YYYY-MM-DD". Go expects ISO format with time.
      const formattedData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };

      await createLeave(formattedData);
      
      //if successful, redirect the user back to the dashboard
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to submit leave. Check the console for errors.');
    }
  };

  return (
    <div className="container">
      <h2>Apply for Leave</h2>
      <form onSubmit={handleSubmit} className="leave-form">
        
        <div className="form-group">
          <label>Employee Name</label>
          <input 
            type="text" required
            value={formData.employee_name} 
            onChange={(e) => setFormData({...formData, employee_name: e.target.value})} 
          />
        </div>

        <div className="form-group">
          <label>Leave Type</label>
          <select 
            value={formData.leave_type} 
            onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
          >
            <option value="Annual">Annual</option>
            <option value="Sick">Sick</option>
            <option value="Casual">Casual</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input 
              type="date" required
              value={formData.start_date} 
              onChange={(e) => setFormData({...formData, start_date: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input 
              type="date" required
              value={formData.end_date} 
              onChange={(e) => setFormData({...formData, end_date: e.target.value})} 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Reason</label>
          <textarea 
            rows={3} required
            value={formData.reason} 
            onChange={(e) => setFormData({...formData, reason: e.target.value})} 
          />
        </div>

        <button type="submit" className="submit-btn">Submit Request</button>
      </form>
    </div>
  );
}