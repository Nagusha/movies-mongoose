const mongoose = require('mongoose');

const criticReviewSchema = new mongoose.Schema({
  reviewId: { 
    type: String, 
    required: true, 
    unique: true 
},
  creationDate: { 
    type: Date, 
    required: false 
},
  originalScore: { 
    type: Number, 
    required: false 
},
  isFresh: { 
    type: Boolean, 
    required: false 
},
  isRotten: { 
    type: Boolean, 
    required: false 
},
  isRtUrl: { 
    type: Boolean, 
    required: false 
},
  isTopCritic: { 
    type: Boolean, 
    required: false
 }
});

const CriticReview = mongoose.model('CriticReview', criticReviewSchema);
module.exports = CriticReview;
