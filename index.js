
const mongoose = require('mongoose');
const connection = require('./connection');
const { Movie } = require('./models/movieschema');
const CriticReview = require('./models/criticschema');
const UserReview = require('./models/userschema');
const { getMoviesByCriteria, getRatingCountsForMovie: getMovieRatingCounts } = require('./query/moviequery');
const { getRatingCountsForMovie: getUserRatingCounts } = require('./query/userquery');

const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const movieCsvFilePath = path.join(__dirname, 'data', 'movies.csv');
const criticCsvFilePath = path.join(__dirname, 'data', 'critic_reviews.csv');
const userCsvFilePath = path.join(__dirname, 'data', 'user_reviews.csv');

async function loadMovies() {
    const results = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(movieCsvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                const criticScore = parseFloat(data.critic_score);
                const audienceScore = parseFloat(data.audience_score);
                data.critic_score = isNaN(criticScore) ? null : criticScore;
                data.audience_score = isNaN(audienceScore) ? null : audienceScore;
                results.push(data);
            })
            .on('end', async () => {
                console.log('Filtered Movies CSV data:', results);
                try {
                    const bulkOps = results.map(doc => ({
                        updateOne: {
                            filter: { movieId: doc.movieId },
                            update: doc,
                            upsert: true
                        }
                    }));
                    const result = await Movie.bulkWrite(bulkOps);
                    console.log('Movies bulk write result:', result);

                    const exampleMovie = results[0]; 
                    const ratingCounts = await getMovieRatingCounts(exampleMovie);
                    console.log('Rating counts for movie:', ratingCounts);

                    const criteria = { movieYear: 2021 };
                    const movies = await getMoviesByCriteria(criteria);
                    console.log('Movies from the year 2021:', movies);

                    resolve();
                } catch (error) {
                    console.error('Error inserting movies data into MongoDB:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading movies CSV file:', error);
                reject(error);
            });
    });
}

async function loadCriticReviews() {
    const results = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(criticCsvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                data.isFresh = data.isFresh === 'True';
                data.isRotten = data.isRotten === 'True';
                data.isRtUrl = data.isRtUrl === 'True';
                data.isTopCritic = data.isTopCritic === 'True';
                data.creationDate = data.creationDate ? new Date(data.creationDate) : null;
                const originalScore = parseFloat(data.originalScore);
                data.originalScore = !isNaN(originalScore) ? originalScore : null;
                results.push(data);
            })
            .on('end', async () => {
                console.log('Filtered Critic Reviews CSV data:', results);
                try {
                    if (mongoose.connection.readyState !== 1) {
                        throw new Error('MongoDB connection is not open');
                    }
                    const validResults = results.filter(doc => !isNaN(doc.originalScore));
                    const bulkOps = validResults.map(doc => ({
                        updateOne: {
                            filter: { reviewId: doc.reviewId },
                            update: { $set: doc },
                            upsert: true
                        }
                    }));
                    const result = await CriticReview.bulkWrite(bulkOps);
                    console.log('Critic Reviews bulk write result:', result);
                    resolve();
                } catch (error) {
                    console.error('Error inserting critic reviews data into MongoDB:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading critic reviews CSV file:', error);
                reject(error);
            });
    });
}

async function loadUserReviews() {
    const results = [];
    const seenUserIds = new Set();

    return new Promise((resolve, reject) => {
        fs.createReadStream(userCsvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                data.rating = data.rating ? parseFloat(data.rating) : null;
                data.score = data.score ? parseFloat(data.score) : null;
                data.creationDate = data.creationDate ? new Date(data.creationDate) : null;
                data.isVerified = data.isVerified === 'True';
                data.isSuperReviewer = data.isSuperReviewer === 'True';
                data.hasSpoilers = data.hasSpoilers === 'True';
                data.hasProfanity = data.hasProfanity === 'True';

                if (!seenUserIds.has(data.userId)) {
                    seenUserIds.add(data.userId);
                    results.push(data);
                }
            })
            .on('end', async () => {
                console.log('Filtered User Reviews CSV data:', results);
                try {
                    const bulkOps = results.map(doc => ({
                        updateOne: {
                            filter: { reviewId: doc.reviewId },
                            update: doc,
                            upsert: true
                        }
                    }));
                    const result = await UserReview.bulkWrite(bulkOps);
                    console.log('User Reviews bulk write result:', result);

                   
                    const exampleUserReview = results[0]; 
                    const userRatingCounts = await getUserRatingCounts(exampleUserReview);
                    console.log('User rating counts for movie:', userRatingCounts);

                    resolve();
                } catch (error) {
                    console.error('Error inserting user reviews data into MongoDB:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading user reviews CSV file:', error);
                reject(error);
            });
    });
}

(async () => {
    try {
        
        await connection();
        console.log('Connected to MongoDB');

        await Promise.all([loadMovies(), loadCriticReviews(), loadUserReviews()]);
        console.log('Data insertion/updating completed successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
})();
