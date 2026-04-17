import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Star, MessageSquare, BookOpen, User, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reviewsRes, statsRes] = await Promise.all([
                    axios.get('http://localhost:5005/api/feedback'),
                    axios.get('http://localhost:5005/api/stats')
                ]);
                setFeedbacks(reviewsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center py-20 text-text-muted">Loading dashboard...</div>;

    return (
        <div className="space-y-8 animate-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={stat._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-primary">{stat._id}</h3>
                            <div className="flex items-center gap-1 text-warning">
                                <Star fill="#f59e0b" size={16} /> 
                                <span className="font-semibold">{stat.avgRating.toFixed(1)}</span>
                            </div>
                        </div>
                        <p className="text-text-muted">Total Reviews: {stat.totalReviews}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Reviews List */}
            <div className="glass-card">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <LayoutDashboard className="text-secondary" /> Recent Course Reviews
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {feedbacks.map((f, i) => (
                        <motion.div 
                            key={f._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold flex items-center gap-2">
                                        <BookOpen size={16} className="text-primary" /> {f.courseCode}
                                    </h4>
                                    <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                                        <User size={14} /> {f.instructor}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 bg-warning/20 text-warning px-2 py-1 rounded-lg text-sm">
                                    <Star fill="#f59e0b" size={14} /> {f.rating}
                                </div>
                            </div>
                            <p className="text-text/90 italic mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
                                <MessageSquare size={14} className="inline mr-2 text-text-muted" />
                                "{f.comments}"
                            </p>
                            <div className="flex justify-between items-center text-xs text-text-muted border-t border-white/5 pt-4">
                                <span className="font-medium text-text">{f.studentName}</span>
                                <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
