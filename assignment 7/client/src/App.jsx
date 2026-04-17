import React, { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import Dashboard from './components/Dashboard';
import { GraduationCap, LayoutDashboard, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="container">
      {/* Header / Navbar */}
      <nav className="nav glass-card mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl text-primary">
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Campus<span className="text-primary">Review</span></h1>
            <p className="text-xs text-text-muted font-medium">Academic Feedback Portal</p>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('student')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activeTab === 'student' ? 'bg-primary text-white' : 'text-text-muted hover:text-white'}`}
          >
            <Send size={18} /> Student
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activeTab === 'admin' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-text-muted hover:text-white'}`}
          >
            <LayoutDashboard size={18} /> Admin
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'student' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'student' ? 20 : -20 }}
          transition={{ duration: 0.3, cubicBezier: [0.4, 0, 0.2, 1] }}
        >
          {activeTab === 'student' ? <FeedbackForm /> : <Dashboard />}
        </motion.main>
      </AnimatePresence>

      <footer className="mt-20 text-center text-text-muted text-sm border-t border-white/5 pt-8 pb-12">
        <p>© 2026 Campus Review System | Real-time Feedback Portal</p>
      </footer>
    </div>
  );
}

export default App;
