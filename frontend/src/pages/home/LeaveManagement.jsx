
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LeaveApply from '../../components/leaveManagement/LeaveApply';
import PendingLeaves from '../../components/leaveManagement/PendingLeaves';
import ApprovedLeaves from '../../components/leaveManagement/ApprovedLeaves';

const LeaveManagement = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all pending leave requests
  const fetchPendingLeaves = async () => {
    try {
      const response = await axios.get('http://localhost:3000/leave/pending');
      setPendingLeaves(response.data);
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
      setMessage('Error fetching pending leaves');
    }
  };

  // Fetch approved leaves
  const fetchApprovedLeaves = async () => {
    try {
      const response = await axios.get('http://localhost:3000/leave/approved');
      setApprovedLeaves(response.data);
    } catch (error) {
      console.error('Error fetching approved leaves:', error);
      setMessage('Error fetching approved leaves');
    }
  };

  // Function to approve or reject leave
  const handleLeaveAction = async (uniqueId, status) => {
    try {
      await axios.put(`http://localhost:3000/leave/update/${uniqueId}`, { status });
      setMessage(`Leave ${status} successfully`);

      // Remove the leave from the pending list once approved or rejected
      setPendingLeaves((prevLeaves) => prevLeaves.filter((leave) => leave.uniqueId !== uniqueId));

      // Optionally, refresh the approved leaves list if the action was 'approved'
      if (status === 'approved') {
        fetchApprovedLeaves();
      }
    } catch (error) {
      setMessage('Error updating leave status');
    }
  };

  // Call the fetch functions on component mount
  useEffect(() => {
    fetchPendingLeaves();
    fetchApprovedLeaves();
  }, []);

  return (
    <div className='leave-management'>
    
      <Routes>
        <Route 
          path="apply-leave" 
          element={<LeaveApply fetchPendingLeaves={fetchPendingLeaves} setMessage={setMessage} />} 
        />
        <Route 
          path="pending-leave" 
          element={<PendingLeaves pendingLeaves={pendingLeaves} handleLeaveAction={handleLeaveAction} />} 
        />
        <Route 
          path="approved-leave" 
          element={<ApprovedLeaves approvedLeaves={approvedLeaves} />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="apply-leave" />} // Redirects to apply leave if no specific route matches
        />
      </Routes>
      <p>{message}</p>
    </div>
  );
};

export default LeaveManagement;
