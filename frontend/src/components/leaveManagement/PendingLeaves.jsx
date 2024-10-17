

import React from 'react';
import './LeaveManagement.css';

// Define the PendingLeaves component
const PendingLeaves = ({ pendingLeaves, handleLeaveAction }) => {
  return (
    <div className="pending-leaves">
      <h3>Applied Leaves (Pending)</h3>
      {/* Check if there are any pending leaves */}
      {pendingLeaves.length === 0 ? (
        <p>No pending leaves found</p> // Display message if no pending leaves
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
            {/* Map through pendingLeaves to display each leave's details */}
            {pendingLeaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.uniqueId}</td> {/* Display unique ID of the leave */}
                <td>{leave.leaveType}</td> {/* Display type of leave */}
                <td>{new Date(leave.startDate).toLocaleDateString()}</td> {/* Display start date */}
                <td>{new Date(leave.endDate).toLocaleDateString()}</td> {/* Display end date */}
                <td>
                  {/* Approve button */}
                  <button
                    onClick={() => handleLeaveAction(leave.uniqueId, 'approved')}
                    style={{ display: leave.status === 'approved' ? 'none' : 'inline-block' }} // Show only if not approved
                  >
                    Approve
                  </button>
                  {/* Reject button */}
                  <button
                    onClick={() => handleLeaveAction(leave.uniqueId, 'rejected')}
                    style={{ display: leave.status === 'approved' ? 'inline-block' : 'none' }} // Show only if approved
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingLeaves; // Export the PendingLeaves component for use in other parts of the application
