import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GoalManagement.css'; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GoalManagement = () => {
  const [uniqueId, setUniqueId] = useState(''); 
  const [goals, setGoals] = useState([]); 
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    progress: '',
  });
  const [progressUpdate, setProgressUpdate] = useState(); 

  const fetchAllGoals = () => {
    axios.get('http://localhost:3000/performance/goal/all')
      .then(response => {
        setGoals(response.data); // Update goals state with fetched data
      })
      .catch(error => {
        console.error('Error fetching goals:', error); // Handle errors
      });
  };


  useEffect(() => {
    fetchAllGoals();
  
  }, []);

  // useEffect(() => {
  //   // Load goals from local storage on mount
  //   const storedGoals = localStorage.getItem('goals');
  //   if (storedGoals) {
  //     setGoals(JSON.parse(storedGoals)); // Set goals from local storage
  //   } else {
  //     fetchAllGoals(); // Fetch from API if not in local storage
  //   }
  // }, []);

  useEffect(() => {
    if (uniqueId) {
      axios.get(`http://localhost:3000/performance/goal/${uniqueId}`)
        .then(response => setGoals(response.data)) // Update goals state with filtered data
        .catch(error => console.error('Error fetching goals:', error)); // Handle errors
    } else {
      fetchAllGoals(); // Fetch all goals if uniqueId is not provided
    }
  }, [uniqueId]);


  const handleInputChange = (e) => {
    const { name, value } = e.target; 
    setNewGoal({ ...newGoal, [name]: value }); 
  };

  const submitGoal = () => {
    console.log(newGoal);
    
    const goalWithUniqueId = { ...newGoal, uniqueId: uniqueId || undefined }; 
    axios.post(`http://localhost:3000/performance/goal/add/${uniqueId}`, goalWithUniqueId)
      .then(response => {
        const updatedGoals = [...goals, response.data]; // Add the new goal to the goals state
        setGoals(updatedGoals);
        setNewGoal({ title: '', description: '', startDate: '', endDate: '', progress: 0 });
        fetchAllGoals();
      })
      .catch(error => console.error('Error adding goal:', error));
  };

  const handleProgressChange = (e) => {
    setProgressUpdate(e.target.value); 
  };


  return (
    <>
      <ToastContainer/>
      <div className="goal-setting-container">
        <h2>Goal Management</h2>
        <input 
          type="text" 
          placeholder="Unique ID" 
          onChange={(e) => setUniqueId(e.target.value)} 
          value={uniqueId} 
        />
        <form>
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
          <button type="button" onClick={submitGoal}>Add Goal</button>
        </form>


      </div>

      <div className="development-plans-container">
        <h4>Existing Goals:</h4>
        {goals.length === 0 ? (
        <p>No goals found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Goal Title</th>
                <th>Description</th>
                <th>Progress (%)</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => (
                <tr key={goal.goalId}> 
                  <td>{goal.employeeId}</td> 
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
