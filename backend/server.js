const express = require('express');
const connectDB = require('./config/db');
const { createInitialUser } = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// CORS options
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Create initial user (if not exists)
createInitialUser();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
