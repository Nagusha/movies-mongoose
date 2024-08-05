const mongoose = require('mongoose');

async function connection() {
    await mongoose.connect('mongodb://localhost:27017/nagusha', {
        //useNewUrlParser: true, // Optional in newer versions
        //useUnifiedTopology: true, // Optional in newer versions
    });
    console.log('Successfully connected to the database');
}

module.exports = connection;
