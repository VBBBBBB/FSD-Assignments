const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    courseCode: { type: String, required: true },
    instructor: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
