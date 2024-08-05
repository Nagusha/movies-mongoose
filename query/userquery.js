const UserReview = require('../models/userschema'); // Adjust the path as needed

async function getRatingCountsForMovie(movie) {
    try {
        const result = await UserReview.aggregate([
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
        console.error('Error getting user rating counts:', error);
        throw error;
    }
}

module.exports = {
    getRatingCountsForMovie
};
