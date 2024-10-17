
const mongoose = require('mongoose');

const developmentPlanSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true }, 
  skillsToDevelop: { type: String, required: true }, 
  resources: { type: String, required: true }, 
  timeline: { type: String, required: true }, 
});

const developmentPlanModel = mongoose.model.DevelopmentPlan|| mongoose.model('DevelopmentPlan', developmentPlanSchema);

module.exports=developmentPlanModel