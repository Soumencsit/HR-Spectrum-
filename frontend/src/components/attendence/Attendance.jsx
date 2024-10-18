import React, { useState } from 'react'; // Importing React and useState hook for managing component state
import axios from 'axios'; // Importing axios for making HTTP requests
import './Attendance.css'; // Importing the CSS file for styling
import { toast, ToastContainer } from 'react-toastify'; // Importing react-toastify for displaying toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing the CSS for toast notifications

const Attendance = () => {
  // Component state to manage the unique ID, status message, and overtime hours
  const [status, setStatus] = useState(''); 
  const [uniqueId, setUniqueId] = useState(''); 
  const [overtimeHours, setOvertimeHours] = useState(null); // State for overtime hours

  // Function to handle check-in operation
  const handleCheckIn = async () => {
    if (!uniqueId) {
      toast.error('Please enter a Unique ID');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/attendance/checkin', { uniqueId });
      setStatus(response.data.message); // Set status message based on the response
      toast.success('Check-in success'); // Display success toast message
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Check-in failed';
      setStatus(errorMessage);
      toast.error(errorMessage); // Display error toast message on failure
    }
  };

  // Function to handle check-out operation
  const handleCheckOut = async () => {
    if (!uniqueId) {
      toast.error('Please enter a Unique ID');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/attendance/checkout', { uniqueId });
      setStatus(response.data.message); // Set status message based on the response
      setOvertimeHours(response.data.overtimeHours); // Set overtime hours state
      toast.success('Check-out success'); // Display success toast message
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Check-out failed';
      setStatus(errorMessage);
      toast.error(errorMessage); // Display error toast message on failure
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
      {overtimeHours !== null && <p className="status">Overtime: {overtimeHours} hours</p>} {/* Display overtime hours */}
    </div>
  );
};

export default Attendance;
