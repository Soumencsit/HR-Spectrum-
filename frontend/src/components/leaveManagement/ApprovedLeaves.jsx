
import React from 'react';
import './LeaveManagement.css';

// Functional component to display approved leaves
const ApprovedLeaves = ({ approvedLeaves, handleDelete }) => {
  return (
    <div className="approved-leaves">
      {/* Check if approvedLeaves is an array and has elements */}
      {Array.isArray(approvedLeaves) && approvedLeaves.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Unique ID</th> {/* Column for the unique ID of the leave */}
              <th>Leave Type</th> {/* Column for the type of leave */}
              <th>From</th> {/* Column for the start date of the leave */}
              <th>To</th> {/* Column for the end date of the leave */}
            </tr>
          </thead>
          <tbody>
            {/* Map through approvedLeaves to display each leave's details */}
            {approvedLeaves.map((leave) => (
              <tr key={leave._id}> {/* Unique key for each row */}
                <td>{leave.uniqueId}</td> {/* Display unique ID */}
                <td>{leave.leaveType}</td> {/* Display leave type */}
                <td>{new Date(leave.startDate).toLocaleDateString()}</td> {/* Display start date in local format */}
                <td>{new Date(leave.endDate).toLocaleDateString()}</td> {/* Display end date in local format */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No approved leaves found</p> // Message when no approved leaves are present
      )}
    </div>
  );
};

export default ApprovedLeaves; // Export the component for use in other parts of the application
