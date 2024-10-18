import React from 'react';
import './LeaveManagement.css';

// Functional component to display approved leaves
const ApprovedLeaves = ({ approvedLeaves, handleDelete }) => {
  console.log(approvedLeaves);
  
  return (
    <div className="approved-leaves">
      {Array.isArray(approvedLeaves) && approvedLeaves.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Unique ID</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
           
            </tr>
          </thead>
          <tbody>
            {approvedLeaves.map((leave) => (
              <tr key={leave.uniqueId}> {/* Use uniqueId instead of _id */}
                <td>{leave.uniqueId}</td>
                <td>{leave.leaveType}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No approved leaves found</p>
      )}
    </div>
  );
};

export default ApprovedLeaves;
