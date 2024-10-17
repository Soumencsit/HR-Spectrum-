
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

  // Function to fetch all performance reviews
  const fetchAllReviews = () => {
    axios.get('http://localhost:3000/performance/review/all')
      .then(response => setReviews(response.data))
      .catch(error => console.error('Error fetching reviews:', error));
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  // Fetch reviews based on uniqueId
  // useEffect(() => {
  //   if (uniqueId) {
  //     axios.get(`http://localhost:3000/performance/review/${uniqueId}`)
  //       .then(response => {
  //         if (response.data === "None") {
  //           setReviews([]); // Clear reviews if none are found
  //         } else {
  //           setReviews(response.data);
  //         }
  //       })
  //       .catch(error => console.error('Error fetching reviews by unique ID:', error));
  //   } else {
  //     fetchAllReviews(); // If no uniqueId, fetch all reviews
  //   }
  // }, [uniqueId]);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Submit the new review
  const submitReview = (e) => {
    e.preventDefault(); // Prevent the page from reloading
    const reviewWithUniqueId = { ...newReview, uniqueId };

    axios.post('http://localhost:3000/performance/review/add', reviewWithUniqueId)
      .then(response => {
        setReviews([...reviews, response.data]); // Add the new review to the existing reviews
        setNewReview({ reviewPeriod: '', rating: '', comments: '' }); // Clear the form
      })
      .catch(error => console.error('Error adding review:', error));
  };

  return (
    <>
      <div className="performance-review-container">
        <h3>Performance Reviews</h3>
        {/* Input field for entering Unique ID */}
        <input 
          type="text" 
          placeholder="Unique ID" 
          onChange={(e) => setUniqueId(e.target.value)} 
          value={uniqueId} 
        />

        {/* Form to submit a new review */}
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
          <button type="submit">Submit Review</button> {/* Button to submit review */}
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
                <tr key={review._id}>
                  <td>{review.uniqueId}</td>
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
