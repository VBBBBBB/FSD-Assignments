const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'autox_super_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/autox_used_items')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));

// --- Auth Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Listings Routes ---

app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get listings for a specific seller
app.get('/api/listings/seller/:sellerId', async (req, res) => {
  try {
    const listings = await Listing.find({ sellerId: req.params.sellerId });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Listing
app.post('/api/listings', async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    const saved = await newListing.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- Booking Routes ---

// Create Booking (Inquiry)
app.post('/api/bookings', async (req, res) => {
  try {
    // Note: in a real world app, we'd verify the sellerId matches the listing
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Seller's Appointments
app.get('/api/seller/appointments/:sellerId', async (req, res) => {
  try {
    const appointments = await Booking.find({ sellerId: req.params.sellerId })
      .populate('listingId')
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Seed Utility ---
app.get('/api/seed', async (req, res) => {
  try {
    await Listing.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});

    // Create a dummy seller
    const hashedPass = await bcrypt.hash('password123', 10);
    const seller = new User({ 
      name: "John Seller", 
      email: "seller@autox.com", 
      password: hashedPass, 
      role: 'Seller' 
    });
    await seller.save();

    // Create a dummy buyer
    const buyer = new User({ 
      name: "Alice Buyer", 
      email: "buyer@autox.com", 
      password: hashedPass, 
      role: 'Buyer' 
    });
    await buyer.save();

    const seedData = [
      {
        title: "2019 Tesla Model 3 Performance",
        price: 32000,
        description: "Midnight Silver Metallic, Autopilot.",
        category: "Car",
        imageUrl: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=2070",
        sellerId: seller._id
      },
      {
        title: "Ducati Monster 821 Dark",
        price: 8500,
        description: "Excellent condition, low miles.",
        category: "Bike",
        imageUrl: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070",
        sellerId: seller._id
      }
    ];
    await Listing.insertMany(seedData);
    res.send("Seeded with Users and Listings!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
