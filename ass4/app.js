const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/collegeDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB. Using fallback data.', err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// fallback data
const fallbackStudents = [
    { name: 'John Doe', course: 'Computer Science', year: 2 },
    { name: 'Jane Smith', course: 'Information Technology', year: 3 }
];

// Routes
// Home Page
app.get('/', (req, res) => {
    res.render('index', { title: 'University College' });
});

// Students List
app.get('/students', async (req, res) => {
    let students = [];
    try {
        if (mongoose.connection.readyState === 1) {
            students = await Student.find();
        } else {
            students = fallbackStudents;
        }
    } catch (err) {
        students = fallbackStudents;
    }
    res.render('students', { title: 'Student Directory', students });
});

// GET Add Student Form
app.get('/add-student', (req, res) => {
    res.render('add-student', { title: 'Admissions' });
});

// POST Add Student
app.post('/add-student', async (req, res) => {
    const { name, course, year } = req.body;

    if (mongoose.connection.readyState === 1) {
        try {
            const newStudent = new Student({ name, course, year });
            await newStudent.save();
        } catch (err) {
            console.error(err);
        }
    } else {
        fallbackStudents.push({ name, course, year });
    }
    res.redirect('/students');
});

// Contact
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
