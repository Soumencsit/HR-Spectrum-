import React from 'react';
import './LeaveManagement.css';

const PendingLeaves = ({ pendingLeaves, handleLeaveAction }) => {
  return (
    <div className="pending-leaves">
      <h3>Applied Leaves (Pending)</h3>
      {pendingLeaves.length === 0 ? (
        <p>No pending leaves found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Unique ID</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingLeaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.uniqueId}</td>
                <td>{leave.leaveType}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleLeaveAction(leave.uniqueId, 'approved')}>Approve</button>
                  <button onClick={() => handleLeaveAction(leave.uniqueId, 'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingLeaves;
