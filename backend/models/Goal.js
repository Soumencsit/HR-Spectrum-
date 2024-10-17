
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
 uniqueId: { type: String, required: true }, 
  title: { type: String, required: true }, 
  description: { type: String, required: true }, 
  startDate: { type: Date, required: true }, 
  endDate: { type: Date, required: true }, 
  progress: { type: Number, default: 0 }, 
});

const goalModel = mongoose.model.Goal|| mongoose.model('Goal', goalSchema);

module.exports=goalModel