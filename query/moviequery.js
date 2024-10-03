
const { Movie } = require('../models/movieschema');

async function getMoviesByCriteria(criteria) {
    try {
        const movies = await Movie.find(criteria).exec();
        return movies;
    } catch (error) {
        console.error('Error querying movies:', error);
        throw error;
    }
}

async function getRatingCountsForMovie(movie) {
    try {
        const result = await Movie.aggregate([
            {
                $match: {
                    movieId: movie.movieId,
                }
            },
            {
                $group: {
                    _id: "$rating", 
                    count: { $sum: 1 } 
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec();
        return result;
    } catch (error) {
        console.error('Error getting rating counts:', error);
        throw error;
    }
}

module.exports = {
    getMoviesByCriteria,
    getRatingCountsForMovie
};
