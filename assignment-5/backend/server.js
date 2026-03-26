const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Models
const Destination = require('./models/Destination');
const Inquiry = require('./models/Inquiry');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Better for backend

// Middleware
app.use(cors()); // Allow React Frontend to connect
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
let isUsingMongoDB = false;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vagabond_travels', {
    serverSelectionTimeoutMS: 5000 // Timeout early
})
.then(() => {
    isUsingMongoDB = true;
    console.log('✅ MongoDB connected successfully.');
    seedDB(); 
})
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.warn('⚠️ Operating in in-memory mode.');
});

// Mock Data
let mockInquiries = [];
const mockDestinations = [
    { name: 'Bali, Indonesia', description: 'Experience luxury villas and tropical sunsets in the heart of Bali.', price: 1200, image: '/images/bali.png', featured: true },
    { name: 'Paris, France', description: 'A romantic escape to the city of lights, culture, and high fashion.', price: 1500, image: '/images/paris.png', featured: true },
    { name: 'Swiss Alps, Switzerland', description: 'Breathtaking mountain views and premium ski resorts.', price: 2000, image: '/images/switzerland.png', featured: true }
];

// Database Seeding
async function seedDB() {
    const count = await Destination.countDocuments();
    if (count === 0) {
        await Destination.insertMany(mockDestinations);
        console.log('Database seeded with initial destinations.');
    }
}

// REST API ROUTES
// 1. Get Featured Destinations
app.get('/api/destinations', async (req, res) => {
    try {
        const destinations = isUsingMongoDB ? await Destination.find() : mockDestinations;
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// 2. Submit Inquiry
app.post('/api/inquiry', async (req, res) => {
    try {
        const { name, email, destination, message } = req.body;
        if (isUsingMongoDB) {
            const newInquiry = new Inquiry({ name, email, destination, message });
            await newInquiry.save();
        } else {
            mockInquiries.push({ name, email, destination, message, date: new Date() });
        }
        res.status(201).json({ message: 'Inquiry submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error submitting inquiry' });
    }
});

// 3. Admin Access: Get Inquiries
app.get('/api/admin/inquiries', async (req, res) => {
    try {
        const inquiries = isUsingMongoDB ? await Inquiry.find().sort({ date: -1 }) : mockInquiries;
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ error: 'Admin view error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Vagabond API Server Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
});
