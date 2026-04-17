const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Feedback = require('./models/Feedback');
const { MongoMemoryServer } = require('mongodb-memory-server');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;


app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    let mongodb_uri = process.env.MONGODB_URI;
    
    if (!mongodb_uri) {
        console.log('No MONGODB_URI found, starting MongoMemoryServer...');
        const mongoServer = await MongoMemoryServer.create();
        mongodb_uri = mongoServer.getUri();
    }

    try {
        await mongoose.connect(mongodb_uri);
        console.log('Connected to MongoDB:', mongodb_uri.startsWith('mongodb://127.0.0.1') ? 'Memory DB' : 'External DB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

connectDB();

// API Routes
app.post('/api/feedback', async (req, res) => {
    try {
        const { studentName, courseCode, instructor, rating, comments } = req.body;
        const feedback = new Feedback({ studentName, courseCode, instructor, rating, comments });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        res.status(400).json({ message: 'Error submitting feedback', error: error.message });
    }
});

app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: "$courseCode",
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            },
            { $sort: { avgRating: -1 } }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
