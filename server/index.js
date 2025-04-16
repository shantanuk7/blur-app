const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

// Configure CORS for specific origins
const corsOptions = {
    origin: '*', // Allow all origins (for testing only)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// Note routes (protected by authMiddleware via noteRoutes)
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));