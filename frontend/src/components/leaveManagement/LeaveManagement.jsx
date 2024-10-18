import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LeaveApply from './LeaveApply';
import PendingLeaves from './PendingLeaves';
import ApprovedLeaves from './ApprovedLeaves';
import './LeaveManagement.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeaveManagement = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [message, setMessage] = useState('');

  // const fetchPendingLeaves = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3000/leave/pending');
  //     setPendingLeaves(response.data);
  //     toast.success('Pending leaves fetched successfully');
  //   } catch (error) {
  //     console.error('Error fetching pending leaves:', error);
  //     setMessage('Error fetching pending leaves');
  //     toast.error('Error fetching pending leaves');
  //   }
  // };


  const fetchPendingLeaves = async () => {
    try {
      const response = await axios.get('http://localhost:3000/leave/pending');
      
      
      if (Array.isArray(response.data)) {
        setPendingLeaves(response.data);
      } else {
        throw new Error('Unexpected data structure');
      }
      
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
  
    }
  };
  
  const fetchApprovedLeaves = async () => {
    try {
      const response = await axios.get('http://localhost:3000/leave/approved');
      setApprovedLeaves(response.data.approvedLeaves); // Adjust based on the API response structure
    
    } catch (error) {
      console.error('Error fetching approved leaves:', error);
  
    }
  };
  

  const handleLeaveAction = async (uniqueId, status) => {
    try {
      await axios.put(`http://localhost:3000/leave/update/${uniqueId}`, { status });
      toast.success(`Leave ${status} successfully`);
      setPendingLeaves((prevLeaves) => prevLeaves.filter((leave) => leave.uniqueId !== uniqueId));
      if (status === 'approved') {
        fetchApprovedLeaves();
      }
    } catch (error) {
      setMessage('Error updating leave status');
      toast.error('Error updating leave status');
    }
  };

  const handleDelete = async (uniqueId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/leave/delete/${uniqueId}`);
      toast.success(response.data.message);
      fetchApprovedLeaves();
    } catch (error) {
      toast.error('Failed to delete leave');
    }
  };

  useEffect(() => {
    fetchPendingLeaves();
    fetchApprovedLeaves();
  }, []);

  return (
    <div className='leave-container'>
      <ToastContainer />
      <Routes>
        <Route path="apply-leave" element={<LeaveApply fetchPendingLeaves={fetchPendingLeaves} setMessage={setMessage} />} />
        <Route path="pending-leave" element={<PendingLeaves pendingLeaves={pendingLeaves} handleLeaveAction={handleLeaveAction} />} />
        <Route path="approved-leave" element={<ApprovedLeaves approvedLeaves={approvedLeaves} handleDelete={handleDelete} />} />
        <Route path="*" element={<Navigate to="apply-leave" />} />
      </Routes>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LeaveManagement;
