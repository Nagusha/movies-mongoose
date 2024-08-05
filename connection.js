const mongoose = require('mongoose');

async function connection() {
    await mongoose.connect('mongodb://localhost:27017/nagusha', {
        //useNewUrlParser: true,
        //useUnifiedTopology: true, 
    });
    console.log('Successfully connected to the database');
}

module.exports = connection;
