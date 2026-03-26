const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // e.g., '/images/bali.png'
    featured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Destination', destinationSchema);
