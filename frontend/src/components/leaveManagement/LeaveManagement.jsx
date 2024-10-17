import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LeaveApply from './LeaveApply';
import PendingLeaves from './PendingLeaves';
import ApprovedLeaves from './ApprovedLeaves';
import './LeaveManagement.css'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const LeaveManagement = () => {
  // State to hold pending and approved leaves and any message to display
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all pending leave requests
  const fetchPendingLeaves = async () => {
    try {
      // Make a GET request to fetch pending leaves
      const response = await axios.get('http://localhost:3000/leave/pending');
      setPendingLeaves(response.data); // Update state with fetched data
      toast.success('Pending leaves fetched successfully'); // Show success toast
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
      setMessage('Error fetching pending leaves'); // Update message state on error
      toast.error('Error fetching pending leaves'); // Show error toast
    }
  };

  // Fetch all approved leave requests
  const fetchApprovedLeaves = async () => {
    try {
      // Make a GET request to fetch approved leaves
      const response = await fetch('http://localhost:3000/leave/approved');
      const data = await response.json(); // Parse the JSON response
      setApprovedLeaves(data); // Update state with fetched data
      toast.success('Approved leaves fetched successfully'); // Show success toast
    } catch (error) {
      console.error('Error fetching approved leaves:', error);
      toast.error('Error fetching approved leaves'); // Show error toast
    }
  };

  // Delete a leave based on its unique ID
  const handleDelete = async (uniqueId) => {
    try {
      // Make a DELETE request to remove the leave
      const response = await fetch(`http://localhost:3000/leave/delete/${uniqueId}`, {
        method: 'DELETE',
      });
      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        toast.success(data.message); // Show success message
        fetchApprovedLeaves(); // Refresh the approved leaves after deletion
      } else {
        toast.error(data.message || 'Failed to delete leave'); // Show error message if deletion fails
      }
    } catch (error) {
      console.error('Error deleting leave:', error);
      toast.error('Failed to delete leave'); // Show error toast
    }
  };

  // Approve or reject leave based on its unique ID and the desired status
  const handleLeaveAction = async (uniqueId, status) => {
    try {
      // Make a PUT request to update the leave status
      await axios.put(`http://localhost:3000/leave/update/${uniqueId}`, { status });
      
      toast.success(`Leave ${status} successfully`); // Show success toast
      setPendingLeaves((prevLeaves) => prevLeaves.filter((leave) => leave.uniqueId !== uniqueId)); // Update pending leaves state

      // Optionally, refresh the approved leaves list if the action was 'approved'
      if (status === 'approved') {
        fetchApprovedLeaves(); // Refresh approved leaves if the leave was approved
      }
    } catch (error) {
      setMessage('Error updating leave status'); // Update message state on error
      toast.error('Error updating leave status'); // Show error toast
    }
  };

  // Fetch pending and approved leaves when the component mounts
  useEffect(() => {
    fetchPendingLeaves(); // Fetch pending leaves
    fetchApprovedLeaves(); // Fetch approved leaves
  }, []);

  return (
    <div className='leave-container'>
      <ToastContainer /> {/* Ensure this is rendered to display toast notifications */}

      <Routes>
        {/* Define routes for applying leave, viewing pending leaves, and viewing approved leaves */}
        <Route path="apply-leave" element={<LeaveApply fetchPendingLeaves={fetchPendingLeaves} setMessage={setMessage} />} />
        <Route path="pending-leave" element={<PendingLeaves pendingLeaves={pendingLeaves} handleLeaveAction={handleLeaveAction} />} />
        <Route path="approved-leave" element={<ApprovedLeaves approvedLeaves={approvedLeaves} handleDelete={handleDelete} />} />
      </Routes>
    </div>
  );
};

export default LeaveManagement;
