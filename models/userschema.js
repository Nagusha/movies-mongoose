const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    reviewId: {
        type: String,
        required: true
    },
    rating: {
        type: Number
    },
    score: {
        type: Number
    },
    creationDate: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true
    },
    isSuperReviewer: {
        type: Boolean,
        required: true
    },
    hasSpoilers: {
        type: Boolean,
        required: true
    },
    hasProfanity: {
        type: Boolean,
        required: true
    }

});

const UserReview = mongoose.model('UserReview', userSchema);

module.exports = UserReview;
