// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true }, 
  reviewPeriod: { type: String, required: true }, 
  rating: { type: Number, required: true }, 
  comments: { type: String, required: true }, 
});

const reviewModel = mongoose.model.Review ||mongoose.model('Review', reviewSchema);
module.exports = reviewModel