const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
    origin: ['https://blur-app-six.vercel.app','http://localhost:4173', 'http://192.168.1.2:4173', 'http://localhost:5173', 'http://13.233.70.197' ],
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
