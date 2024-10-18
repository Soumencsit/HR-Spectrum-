const express = require("express");
const reviewRouter = express.Router();
const UnifiedModel = require("../models/UnifiedModel");

// Fetch all reviews
reviewRouter.get("/all", async (req, res) => {
  try {
    const employees = await UnifiedModel.find({}, { uniqueId: 1, reviews: 1 }); // Include uniqueId in the query

    // Extract reviews and map to include employee ID and relevant details
    const allReviews = employees.flatMap(employee => 
      employee.reviews.map(review => ({
        employeeId: employee.uniqueId, // Include the employee's unique ID
        reviewPeriod: review.reviewPeriod,
        rating: review.rating,
        comments: review.comments,
      }))
    );

    res.json(allReviews); // Respond with the list of all reviews
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});



// Add a new review
reviewRouter.post("/add/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;
  const newReview = req.body;

  try {
    const employee = await UnifiedModel.findOne({ uniqueId });
    if (!employee) return res.status(404).json({ message: "Invalid employee ID." }); // Check for employee existence

    employee.reviews.push(newReview);
    await employee.save();
    res.status(201).json(newReview); // Send back the newly added review
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Fetch reviews for a specific employee
reviewRouter.get("/:uniqueId", async (req, res) => {
  try {
    const employee = await UnifiedModel.findOne({ uniqueId: req.params.uniqueId }, { reviews: 1 });
    if (!employee) return res.status(404).json({ message: "Reviews not found" });
    res.json(employee.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = reviewRouter;
