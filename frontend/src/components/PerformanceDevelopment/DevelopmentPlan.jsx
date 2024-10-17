import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DevelopmentPlan.css';

const DevelopmentPlan = () => {
  // State to hold the unique ID for fetching specific development plans
  const [uniqueId, setUniqueId] = useState(''); 
  // State to hold all development plans fetched from the API
  const [plans, setPlans] = useState([]);
  // State to hold the new development plan input fields
  const [newPlan, setNewPlan] = useState({
    skillsToDevelop: '',
    resources: '',
    timeline: '',
  });

  // Function to fetch all development plans from the server
  const fetchAllPlans = () => {
    axios.get('http://localhost:3000/performance/development/all') // API endpoint to fetch all plans
      .then(response => setPlans(response.data)) // Update state with fetched plans
      .catch(error => console.error('Error fetching all development plans:', error)); // Log any errors
  };

  // Fetch all plans on component mount
  useEffect(() => {
    fetchAllPlans();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Fetch development plans whenever uniqueId changes
  useEffect(() => {
    if (uniqueId) {
      // If uniqueId is set, fetch specific development plans
      axios.get(`http://localhost:3000/performance/development/${uniqueId}`)
        .then(response => setPlans(response.data)) // Update plans state with fetched data
        .catch(error => console.error('Error fetching development plans:', error)); // Log any errors
    } else {
      // If uniqueId is empty, fetch all plans
      fetchAllPlans();
    }
  }, [uniqueId]); // Effect runs whenever uniqueId changes

  // Handle input changes in the new plan form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the newPlan state with the changed input field
    setNewPlan({ ...newPlan, [name]: value });
  };

  // Function to submit the new development plan
  const submitPlan = () => {
    axios.post('http://localhost:3000/performance/development/add', { ...newPlan, uniqueId }) // API endpoint to add a new plan
      .then(response => {
        // Update the plans state with the newly added plan
        setPlans([...plans, response.data]);
        // Clear the form fields after submission
        setNewPlan({ skillsToDevelop: '', resources: '', timeline: '' });
      })
      .catch(error => console.error('Error adding development plan:', error)); // Log any errors
  };

  return (
    <>
      <div className="goal-setting-container">
        <h2>Development Plans</h2>
        <input 
          type="text" 
          placeholder="Unique ID" 
          onChange={(e) => setUniqueId(e.target.value)} // Update uniqueId state on input change
          value={uniqueId} 
        />
        
        <form>
          <input 
            type="text" 
            name="skillsToDevelop" 
            placeholder="Skills to Develop" 
            onChange={handleInputChange} // Handle changes for skills input
            value={newPlan.skillsToDevelop} 
          />
          <input 
            type="text" 
            name="resources" 
            placeholder="Learning Resources" 
            onChange={handleInputChange} // Handle changes for resources input
            value={newPlan.resources} 
          />
          <input 
            type="text" 
            name="timeline" 
            placeholder="Timeline" 
            onChange={handleInputChange} // Handle changes for timeline input
            value={newPlan.timeline} 
          />
          <button type="button" onClick={submitPlan}>Add Development Plan</button> {/* Submit new plan */}
        </form>
      </div>

      <div className="development-plans-container">
        <h4>Existing Plans:</h4>
        {plans.length === 0 ? (
          <p>No development plans found</p> // Display message if no plans exist
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee Id</th>
                <th>Skills to Develop</th>
                <th>Learning Resources</th>
                <th>Timeline</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan._id}>
                  <td>{plan.uniqueId}</td>
                  <td>{plan.skillsToDevelop}</td>
                  <td>{plan.resources}</td>
                  <td>{plan.timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default DevelopmentPlan;
