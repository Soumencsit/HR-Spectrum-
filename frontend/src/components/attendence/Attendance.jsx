import React, { useState } from 'react'; // Importing React and useState hook for managing component state
import axios from 'axios'; // Importing axios for making HTTP requests
import './Attendance.css'; // Importing the CSS file for styling
import { toast, ToastContainer } from 'react-toastify'; // Importing react-toastify for displaying toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing the CSS for toast notifications

const Attendance = () => {
  // Component state to manage the unique ID and the status message
  const [status, setStatus] = useState(''); 
  const [uniqueId, setUniqueId] = useState(''); 

  // Function to handle check-in operation
  const handleCheckIn = async () => {
    try {
      // Sending a POST request to check in the user with the provided unique ID
      const response = await axios.post('http://localhost:3000/attendance/checkin', { uniqueId });
      toast.success('Check-in success'); // Display success toast message
    } catch (error) {
      toast.error('Check-in failed'); // Display error toast message on failure
    }
  };

  // Function to handle check-out operation
  const handleCheckOut = async () => {
    try {
      // Sending a POST request to check out the user with the provided unique ID
      const response = await axios.post('http://localhost:3000/attendance/checkout', { uniqueId });
      toast.success('Check-out success'); // Display success toast message
      toast.success(`Overtime ${response.data.overtimeHours} hours`); // Display overtime hours if available
    } catch (error) {
      toast.error('Check-out failed'); // Display error toast message on failure
    }
  };

  // JSX for rendering the attendance form and buttons
  return (
    <div className="container">
      <ToastContainer /> {/* Toast container for showing notifications */}
      <h2>Attendance</h2>
      <input 
        type="text" 
        className="input" 
        value={uniqueId} 
        onChange={(e) => setUniqueId(e.target.value)} // Update uniqueId when input value changes
        placeholder="Enter Unique ID" 
      />
      <button className="button" onClick={handleCheckIn}>Check In</button> {/* Button to trigger check-in */}
      <button className="button" onClick={handleCheckOut}>Check Out</button> {/* Button to trigger check-out */}
      <p className="status">{status}</p> {/* Placeholder for displaying any status messages */}
    </div>
  );
};

export default Attendance;
