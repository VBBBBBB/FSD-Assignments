const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    bookingDate: { type: Date, default: Date.now },
    travelDate: { type: Date, required: true },
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Booking', bookingSchema);
