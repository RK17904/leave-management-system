import { useEffect, useState } from 'react';
import { getLeaves, type Leave } from '../services/api';

export default function Dashboard() {
  //leave[] type defined in api.ts
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await getLeaves();
        setLeaves(data);
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  if (loading) return <div className="container">Loading data from Go server...</div>;

  return (
    <div className="container">
      <h2>Employee Leave Requests</h2>
      
      {leaves.length === 0 ? (
        <p style={{ marginTop: '20px' }}>No leave requests found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, index) => (
              <tr key={leave.ID || index}>
                <td>{leave.employee_name}</td>
                <td>{leave.leave_type}</td>
                {/* format ISO dates to readable dates */}
                <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                <td>{leave.reason}</td>
                <td>
                  <span className={`status-badge status-${leave.status}`}>
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}