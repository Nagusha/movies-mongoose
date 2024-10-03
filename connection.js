const mongoose = require('mongoose');

async function connection() {
    await mongoose.connect('mongodb://localhost:27017/nagusha', {
       
    });
    console.log('Successfully connected to the database');
}

module.exports = connection;
