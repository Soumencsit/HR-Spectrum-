

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GoalManagement.css'; // Import the CSS for styling
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GoalManagement = () => {
  const [uniqueId, setUniqueId] = useState(''); // State to hold the unique ID for filtering goals
  const [goals, setGoals] = useState([]); // State to hold the list of goals
  const [newGoal, setNewGoal] = useState({ // State to manage the new goal input fields
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    progress: '',
  });
  const [progressUpdate, setProgressUpdate] = useState(); // State for updating progress

  // Function to fetch all goals from the server
  const fetchAllGoals = () => {
    axios.get('http://localhost:3000/performance/goal/all')
      .then(response => setGoals(response.data)) // Update goals state with fetched data
      .catch(error => console.error('Error fetching goals:', error)); // Handle errors
  };

  // useEffect to fetch all goals on component mount
  useEffect(() => {
    fetchAllGoals();
  }, []); // Empty dependency array means this runs only once after the initial render

  // useEffect to fetch goals based on uniqueId if it exists
  useEffect(() => {
    if (uniqueId) {
      axios.get(`http://localhost:3000/performance/goal/${uniqueId}`)
        .then(response => setGoals(response.data)) // Update goals state with filtered data
        .catch(error => console.error('Error fetching goals:', error)); // Handle errors
    } else {
      fetchAllGoals(); // Fetch all goals if uniqueId is not provided
    }
  }, [uniqueId]); // This runs whenever uniqueId changes

  // Function to handle input changes for new goal fields
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the event target
    setNewGoal({ ...newGoal, [name]: value }); // Update the specific field in newGoal state
  };

  // Function to submit a new goal
  const submitGoal = () => {
    const goalWithUniqueId = { ...newGoal, uniqueId: uniqueId || undefined }; // Create goal object
    axios.post('http://localhost:3000/performance/goal/add', goalWithUniqueId)
      .then(response => {
        setGoals([...goals, response.data]); // Add the new goal to the goals state
        // Reset newGoal state to initial values
        setNewGoal({ title: '', description: '', startDate: '', endDate: '', progress: 0 }); 
      })
      .catch(error => console.error('Error adding goal:', error)); // Handle errors
  };

  // Function to handle progress update input
  const handleProgressChange = (e) => {
    setProgressUpdate(e.target.value); // Update the progress state with the new value
  };

  // Function to submit progress update
  const submitProgressUpdate = () => {
    if (!uniqueId || !progressUpdate) {
      console.error('Unique ID and progress are required to update.'); // Handle error for missing fields
      return;
    }

    axios.put(`http://localhost:3000/performance/goal/update/${uniqueId}`, { progress: progressUpdate }) // Send request to update progress
      .then(response => {
        // Update the goals state with the updated progress
        setGoals(goals.map(goal => goal.uniqueId === uniqueId ? { ...goal, progress: response.data.progress } : goal));
        setProgressUpdate(0); // Reset progress update state
        toast.success('Goal Updated Success Fully')
      })
      .catch(error => console.error('Error updating progress:', error)); // Handle errors
  };

  return (
    <>
    <ToastContainer/>
      <div className="goal-setting-container">
        <h2>Goal Management</h2>
        {/* Input for unique ID to filter goals */}
        <input 
          type="text" 
          placeholder="Unique ID" 
          onChange={(e) => setUniqueId(e.target.value)} 
          value={uniqueId} 
        />

        <form>
          {/* Input fields for the new goal */}
          <input 
            type="text" 
            name="title" 
            placeholder="Goal Title" 
            onChange={handleInputChange} 
            value={newGoal.title} 
          />
          <input 
            type="text" 
            name="description" 
            placeholder="Description" 
            onChange={handleInputChange} 
            value={newGoal.description} 
          />
          <label htmlFor='startDate'>Start Date</label>
          <input 
            type="date" 
            name="startDate" 
            id='startDate'
            onChange={handleInputChange} 
            value={newGoal.startDate} 
          />
          <label htmlFor='endDate'>End Date</label>
          <input 
            type="date" 
            name="endDate"
            id='endDate' 
            onChange={handleInputChange} 
            value={newGoal.endDate} 
          />
          
          <input 
            type="number" 
            name="progress" 
            placeholder="Progress (%)" 
            onChange={handleInputChange} 
            value={newGoal.progress} 
          />
          {/* Button to submit the new goal */}
          <button type="button" onClick={submitGoal}>Add Goal</button>
        </form>

        {/* Form for updating progress */}
        
        <input 
          type="number" 
          placeholder="New Progress (%)" 
          onChange={handleProgressChange} 
          value={progressUpdate} 
          className='update-goal'
        />
        <button type="button" onClick={submitProgressUpdate}>Update Progress</button>
      </div>

      <div className="development-plans-container">
        <h4>Existing Goals:</h4>
        {/* Display existing goals or a message if none found */}
        {goals.length === 0 ? (
          <p>No goals found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Unique ID</th>
                <th>Goal Title</th>
                <th>Description</th>
                <th>Progress (%)</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => (
                <tr key={goal._id}> {/* Use goal ID as key for efficient re-renders */}
                  <td>{goal.uniqueId}</td>
                  <td>{goal.title}</td>
                  <td>{goal.description}</td>
                  <td>{goal.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default GoalManagement;
