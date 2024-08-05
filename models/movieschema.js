const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieId: { 
        type: String, 
        required: true,
        unique: true
    },
    movieTitle: { 
        type: String, 
        required: true,
        unique: true
    },
    movieYear: { 
        type: Number, 
        required: true 
    },
    movieURL: { 
        type: String, 
        required: true,
        unique: true
    },
    movieRank: { 
        type: Number, 
        required: true 
    },
    critic_score: { 
        type: Number, 
        required: true
    },
    audience_score: { 
        type: Number,
        required: true
    }
});
const Movie = mongoose.model('Movie', movieSchema);

module.exports = { Movie };