
import React, { useState } from 'react';
import axios from 'axios';
import LeaveManagement from './LeaveManagement';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const LeaveApply = ({ fetchPendingLeaves, setMessage }) => {
  // State to hold leave application data
  const [leaveData, setLeaveData] = useState({
    uniqueId: '',     // Employee's unique ID
    leaveType: '',    // Type of leave selected
    startDate: '',    // Start date of the leave
    endDate: '',      // End date of the leave
  });

  // Function to handle input field changes
  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value }); // Update corresponding field in state
  };

  // Function to handle leave application submission
  const handleApplyLeave = async () => {
    // Check if unique ID is entered
    if (!leaveData.uniqueId) {
      toast.error('Please enter a Unique ID.'); // Show error message
      setMessage('Please enter a Unique ID.'); // Set message for parent component
      return; // Exit function if unique ID is not provided
    }
  
    try {
      // Send leave application data to the server
      await axios.post('http://localhost:3000/leave/apply', { ...leaveData });
      toast.success('Leave applied successfully'); // Show success message
      
      fetchPendingLeaves(); // Refresh the pending leaves list
    } catch (error) {
      toast.error('Error applying leave'); // Show error message on failure
    }
  };
  
  return (
    <div className="apply-leave">
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <input
        type="text"
        name="uniqueId" // Name attribute matches the state key
        value={leaveData.uniqueId} // Controlled input for unique ID
        onChange={handleChange} // Call handleChange on input change
        placeholder="Enter Employee ID" // Placeholder for input
      />
      <select name="leaveType" value={leaveData.leaveType} onChange={handleChange}>
        <option value="">Select Leave Type</option>
        <option value="vacation">Vacation</option>
        <option value="sick">Sick Leave</option>
        <option value="personal">Personal Leave</option>
      </select>
      
      <div className='input-date'>
        <div className='input-date-1'>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate" // Add the id for association with the label
            name="startDate"
            value={leaveData.startDate} // Controlled input for start date
            onChange={handleChange} // Call handleChange on input change
          />
        </div>

        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"  // Add the id for association with the label
            name="endDate"
            value={leaveData.endDate} // Controlled input for end date
            onChange={handleChange} // Call handleChange on input change
            placeholder='End Date'
          />
        </div>
      </div>
      
      <button onClick={handleApplyLeave}>Apply Leave</button> {/* Button to submit leave application */}
    </div>
  );
};

export default LeaveApply; // Export the component for use in other parts of the application
