import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';

// app config 
const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB().catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  // Exit process if DB connection fails
});

// Connect to Cloudinary
connectCloudinary().catch((error) => {
    console.error('Error connecting to Cloudinary:', error);
    process.exit(1);  // Exit process if Cloudinary connection fails
});

// middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/admin', adminRouter);

// API Working check
app.get('/', (req, res) => {
    res.send('API Working yeahh');
});

// Start server
app.listen(port, () => {
    console.log(`Server started on Port ${port}`);
});
