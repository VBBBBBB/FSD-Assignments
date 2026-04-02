const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const User = require('./models/User');
const Destination = require('./models/Destination');
const Booking = require('./models/Booking');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session config
app.use(session({
    secret: 'azure_horizon_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Global user variable for templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Auth Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/login');
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') return next();
    res.status(403).send('Access Denied: Admins Only');
};

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/azurehorizon';
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        seedData();
    })
    .catch(err => console.error('Could not connect to MongoDB', err));

// --- Auth Routes ---
app.get('/login', (req, res) => res.render('login', { error: null }));
app.get('/register', (req, res) => res.render('register', { error: null }));

app.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.render('register', { error: 'Username or Email already exists' });
        
        const newUser = new User({ username, email, password, role });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: 'Registration failed. Try again.' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.render('login', { error: 'Invalid email or password' });
        }
        // Set session
        req.session.user = { id: user._id, username: user.username, role: user.role };
        res.redirect('/');
    } catch (err) {
        res.render('login', { error: 'Login failed.' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// --- Main Routes ---
app.get('/', async (req, res) => {
    const featured = await Destination.find({ featured: true });
    res.render('home', { featured });
});

app.get('/destinations', async (req, res) => {
    const destinations = await Destination.find();
    res.render('destinations', { destinations });
});

app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));

app.get('/book/:id', isAuthenticated, async (req, res) => {
    const destination = await Destination.findById(req.params.id);
    res.render('booking', { destination });
});

app.post('/book', isAuthenticated, async (req, res) => {
    try {
        const { destinationId, userName, email, travelDate } = req.body;
        const newBooking = new Booking({ 
            destinationId, 
            userId: req.session.user.id,
            userName, 
            email, 
            travelDate 
        });
        await newBooking.save();
        res.render('success', { message: 'Inquiry received! Our concierge will contact you soon.' });
    } catch (err) {
        res.status(500).send('Error processing inquiry');
    }
});

// --- Admin Dashboard ---
app.get('/admin/dashboard', isAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().populate('destinationId').populate('userId');
        res.render('admin/dashboard', { bookings });
    } catch (err) {
        res.status(500).send('Admin Dashboard Error');
    }
});

// Seed Data
async function seedData() {
    const count = await Destination.countDocuments();
    if (count === 0) {
        const initialDestinations = [
            {
                name: 'Udaipur, India',
                description: 'The City of Lakes, offering royal heritage and majestic palaces.',
                price: 900,
                image: 'https://images.unsplash.com/photo-1590050752117-23a9d7fc244d?auto=format&fit=crop&w=800&q=80',
                location: 'Rajasthan',
                featured: true
            },
            {
                name: 'Kerala Backwaters, India',
                description: 'Serene houseboats and lush greenery in God\'s Own Country.',
                price: 750,
                image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
                location: 'Kerala',
                featured: true
            },
            {
                name: 'Ladakh, India',
                description: 'Dramatic landscapes and spiritual peace in the High Himalayas.',
                price: 1100,
                image: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=800&q=80',
                location: 'Jammu & Kashmir',
                featured: true
            },
            {
                name: 'Santorini, Greece',
                description: 'White-washed houses and stunning sunsets over the Aegean Sea.',
                price: 1200,
                image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
                location: 'Cyclades',
                featured: false
            }
        ];
        await Destination.insertMany(initialDestinations);
        console.log('Database seeded with Azure Horizon destinations');

        // Create a default admin if not exists
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const admin = new User({
                username: 'admin',
                email: 'admin@azurehorizon.com',
                password: 'adminpassword123',
                role: 'admin'
            });
            await admin.save();
            console.log('Default Admin Created: admin@azurehorizon.com / adminpassword123');
        }
    }
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
