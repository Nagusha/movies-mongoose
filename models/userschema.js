const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a User
const userSchema = new Schema({
    userId: {
        type: String,
        required: true
       // unique: true
    },
    reviewId: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        default: null
    },
    score: {
        type: Number,
        default: null
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isSuperReviewer: {
        type: Boolean,
        default: false
    },
    hasSpoilers: {
        type: Boolean,
        default: false
    },
    hasProfanity: {
        type: Boolean,
        default: false
    }

});

// Create the model from the schema
const UserReview = mongoose.model('UserReview', userSchema);

module.exports = UserReview;
