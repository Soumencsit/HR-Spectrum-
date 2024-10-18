import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeaveApply = ({ fetchPendingLeaves, setMessage }) => {
  const [leaveData, setLeaveData] = useState({
    uniqueId: '',
    leaveType: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const handleApplyLeave = async () => {
    if (!leaveData.uniqueId) {
      toast.error('Please enter a Unique ID.');
      setMessage('Please enter a Unique ID.');
      return;
    }

    try {
      // Check if the employee exists
      const employeeCheckResponse = await axios.get(`http://localhost:3000/leave/check/${leaveData.uniqueId}`);
      console.log(leaveData.uniqueId);
      
      if (employeeCheckResponse.status !== 200) {
        toast.error('Invalid Employee ID.');
        return;
      }

      // Apply for leave if employee exists
      await axios.post(`http://localhost:3000/leave/apply/${leaveData.uniqueId}`, {
        status:"pending",
        leaveType: leaveData.leaveType,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
      });
      toast.success('Leave applied successfully');
      // fetchPendingLeaves();
      setLeaveData({ uniqueId: '', leaveType: '', startDate: '', endDate: '' }); // Clear form
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('Invalid Employee ID.');
      } else {
        toast.error('Error applying leave');
      }
    }
  };

  return (
    <div className="apply-leave">
      <ToastContainer />
      <input
        type="text"
        name="uniqueId"
        value={leaveData.uniqueId}
        onChange={handleChange}
        placeholder="Enter Employee ID"
      />
      <select name="leaveType" value={leaveData.leaveType} onChange={handleChange}>
        <option value="">Select Leave Type</option>
        <option value="vacation">Vacation</option>
        <option value="sick">Sick Leave</option>
        <option value="personal">Personal Leave</option>
      </select>
      <div className='input-date'>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={leaveData.startDate}
          onChange={handleChange}
        />
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={leaveData.endDate}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleApplyLeave}>Apply Leave</button>
    </div>
  );
};

export default LeaveApply;
