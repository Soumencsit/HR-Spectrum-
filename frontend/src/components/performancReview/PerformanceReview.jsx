import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PerformanceReview.css';

const PerformanceReview = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    reviewPeriod: '',
    rating: '',
    comments: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Function to fetch all performance reviews
  const fetchAllReviews = () => {
    axios.get('http://localhost:3000/performance/review/all')
      .then(response => {
        setReviews(response.data); // Assuming response.data is an array of reviews
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  };

  useEffect(() => {
    fetchAllReviews();
  
  
    
   
    
  }, []);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Submit the new review
  const submitReview = (e) => {
    e.preventDefault();
    if (!uniqueId) {
      setErrorMessage('Please enter a Unique ID before submitting the review.');
      return;
    }

    const reviewWithUniqueId = { ...newReview, uniqueId };

    axios.post(`http://localhost:3000/performance/review/add/${uniqueId}`, reviewWithUniqueId)
      .then(response => {
        setReviews([...reviews, response.data]);
        setNewReview({ reviewPeriod: '', rating: '', comments: '' });
        fetchAllReviews()
        setErrorMessage('');
      })
      .catch(error => {
        // Check if the error response indicates an invalid employee ID
        if (error.response && error.response.status === 404) {
          setErrorMessage('Invalid employee ID.');
        } else {
          setErrorMessage('Error adding review. Please try again.');
        }
      });
  };

  return (
    <>
      <div className="performance-review-container">
        <h3>Performance Reviews</h3>
        <input 
          type="text" 
          placeholder="Unique ID" 
          onChange={(e) => {
            setUniqueId(e.target.value);
            setErrorMessage(''); // Clear error message on Unique ID change
          }} 
          value={uniqueId} 
        />
        <form onSubmit={submitReview}>
          <input 
            type="text" 
            name="reviewPeriod" 
            placeholder="Review Date" 
            onChange={handleInputChange}
            value={newReview.reviewPeriod} 
          />
          <input 
            type="number" 
            name="rating" 
            placeholder="Rating (1-5)" 
            onChange={handleInputChange}
            value={newReview.rating} 
          />
          <textarea 
            name="comments" 
            placeholder="Comments" 
            onChange={handleInputChange}
            value={newReview.comments} 
          />
          <button type="submit">Submit Review</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>} 
        </form>
      </div>
      <div className="performance-reviews-table-container">
        <h4>Past Reviews:</h4>
        {reviews.length === 0 ? (
          <p>No performance reviews found</p>
        ) : (
          <table>
          <thead>
            <tr>
              <th>Unique ID</th>
              <th>Review Period</th>
              <th>Rating</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}> {/* Use unique identifier for the key */}
                <td>{review.employeeId}</td> {/* Display the uniqueId */}
                <td>{review.reviewPeriod}</td>
                <td>{review.rating}</td>
                <td>{review.comments}</td>
              </tr>
            ))}
        </tbody>
        </table>
        )}
      </div>
    </>
  );
};

export default PerformanceReview;
