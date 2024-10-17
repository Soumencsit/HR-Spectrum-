// routes/reviews.js
const express = require("express");
const reviewRouter = express.Router();
const Review = require("../models/Review");


reviewRouter.post("/add", async (req, res) => {
  const review = new Review(req.body);
  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//
reviewRouter.get("/all", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



reviewRouter.get("/:uniqueId", async (req, res) => {
  try {
    const reviews = await Review.find({ uniqueId: req.params.uniqueId });

    if (reviews.length === 0) {
      // If no reviews are found, send a "None" response
      return res.json("None");
    }

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});






module.exports = reviewRouter;
