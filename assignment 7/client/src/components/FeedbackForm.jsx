import React, { useState } from 'react';
import { Star, GraduationCap, User, BookOpen, Send } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        courseCode: '',
        instructor: '',
        rating: 5,
        comments: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleRating = (r) => setFormData({ ...formData, rating: r });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', message: 'Submitting...' });
        try {
            await axios.post('http://localhost:5005/api/feedback', formData);
            setStatus({ type: 'success', message: 'Feedback submitted! Thank you.' });
            setFormData({ studentName: '', courseCode: '', instructor: '', rating: 5, comments: '' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to submit. Please try again.' });
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card max-w-2xl mx-auto animate-in"
        >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <GraduationCap className="text-primary" /> Academic Review
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm text-text-muted mb-1">
                            <User size={16} /> Student Name
                        </label>
                        <input 
                            required
                            placeholder="John Doe"
                            value={formData.studentName}
                            onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm text-text-muted mb-1">
                            <BookOpen size={16} /> Course Code
                        </label>
                        <input 
                            required
                            placeholder="CS101"
                            value={formData.courseCode}
                            onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm text-text-muted mb-1">
                        <User size={16} /> Instructor Name
                    </label>
                    <input 
                        required
                        placeholder="Dr. Smith"
                        value={formData.instructor}
                        onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm text-text-muted mb-2">Overall Rating</label>
                    <div className="rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                                key={star}
                                className={`star ${formData.rating >= star ? 'text-warning fill-warning' : 'text-text-muted'}`}
                                onClick={() => handleRating(star)}
                                size={32}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-text-muted mb-1">Detailed Comments</label>
                    <textarea 
                        required
                        rows="4"
                        placeholder="What did you like? What can be improved?"
                        value={formData.comments}
                        onChange={(e) => setFormData({...formData, comments: e.target.value})}
                    ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                    <Send size={18} /> Submit Review
                </button>

                {status.message && (
                    <div className={`mt-4 p-3 rounded-xl text-center ${status.type === 'success' ? 'bg-success/20 text-success' : status.type === 'error' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20'}`}>
                        {status.message}
                    </div>
                )}
            </form>
        </motion.div>
    );
};

export default FeedbackForm;
