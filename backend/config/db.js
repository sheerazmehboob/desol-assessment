const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/desolint", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected...');
        });

        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected...');
        });

    } catch (err) {
        console.error(`MongoDB connection error: ${err}`);
        process.exit(1);
    }
};

module.exports = connectDB;
