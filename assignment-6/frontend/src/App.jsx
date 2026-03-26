import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ShoppingCart, LogOut, LayoutDashboard, ChevronRight, CheckCircle, Info } from 'lucide-react';
import './App.css';
import Auth from './Auth';
import SellerPortal from './SellerPortal';

const API_BASE = 'http://localhost:5000/api';

const App = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  
  // Auth state
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [view, setView] = useState('marketplace'); // 'marketplace', 'auth', 'seller'

  useEffect(() => {
    fetchListings();
    // Redirect if they were on seller portal and refreshed
    if (user?.role === 'Seller' && view === 'marketplace') {
      // Stay on marketplace unless requested otherwise
    }
  }, []);

  const fetchListings = async () => {
    try {
      const resp = await axios.get(`${API_BASE}/listings`);
      setListings(resp.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setView('marketplace');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setView('auth');
      return;
    }
    const formData = new FormData(e.target);
    const bookingData = {
      listingId: selectedItem._id,
      sellerId: selectedItem.sellerId, // The seller of this specific item
      customerName: formData.get('name') || user.name,
      email: formData.get('email') || user.email,
      phone: formData.get('phone'),
      appointmentDate: formData.get('date'),
      message: formData.get('message'),
    };

    try {
      await axios.post(`${API_BASE}/bookings`, bookingData);
      setBookingStatus('success');
      setTimeout(() => {
        setBookingStatus(null);
        setSelectedItem(null);
      }, 3000);
    } catch (err) {
      alert("Booking failed.");
    }
  };

  const filteredListings = filter === 'All' 
    ? listings 
    : listings.filter(item => item.category === filter);

  return (
    <div className="App">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', alignItems: 'center', marginBottom: '4rem', zIndex: 100 }}
      >
        <h2 style={{ fontWeight: 800, letterSpacing: '-1px', cursor: 'pointer' }} onClick={() => setView('marketplace')}>
          Auto<span style={{ color: 'var(--primary)' }}>X</span>
        </h2>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => setView('marketplace')}>Marketplace</span>
          
          {user ? (
            <>
              {user.role === 'Seller' && (
                <button 
                  className="btn-glass" 
                  style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => setView('seller')}
                >
                  <LayoutDashboard size={16} /> Dashboard
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                <User size={16} /> {user.name} ({user.role})
                <LogOut size={16} style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={handleLogout} />
              </div>
            </>
          ) : (
            <button className="btn-primary" style={{ padding: '0.5rem 1.2rem' }} onClick={() => setView('auth')}>Login</button>
          )}
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {view === 'auth' ? (
          <Auth key="auth" onAuthSuccess={(u) => { setUser(u); setView('marketplace'); }} />
        ) : view === 'seller' ? (
          <SellerPortal key="seller" user={user} />
        ) : (
          <motion.div key="marketplace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="hero">
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                Luxury Pre-Owned <br /> Performance.
              </motion.h1>
            </div>

            <div className="filter-tabs">
              {['All', 'Car', 'Bike'].map(cat => (
                <button key={cat} className={`tab ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>{cat}s</button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem' }}>✨ Fetching Inventory...</div>
            ) : (
              <div className="listing-grid">
                {filteredListings.map(item => (
                  <motion.div key={item._id} className="glass-card" layout>
                    <img src={item.imageUrl} alt={item.title} className="card-image" />
                    <div className="card-content">
                      <span className="badge">{item.category}</span>
                      <h3>{item.title}</h3>
                      <p className="card-price">${item.price.toLocaleString()}</p>
                      <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{item.description}</p>
                      <button 
                        className="btn-primary" 
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        onClick={() => setSelectedItem(item)}
                      >
                        <Calendar size={18} /> Book Appointment
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal (Shared) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div className="glass-card" initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }} style={{ maxWidth: '500px', width: '90%', margin: 'auto' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2>Booking Request</h2>
                  <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>
                {!user && <p style={{ color: '#ff4d4f', fontSize: '0.8rem', marginTop: '10px' }}>⚠️ Please login as a Buyer to request viewings.</p>}
                <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>For: {selectedItem.title}</p>
              </div>

              {bookingStatus === 'success' ? (
                <div className="booking-form" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <CheckCircle size={64} color="#5ac8fa" style={{ margin: '0 auto 1.5rem' }} />
                  <h3>Request Sent to Seller!</h3>
                  <p style={{ color: 'var(--text-dim)' }}>The owner will be notified of your request.</p>
                </div>
              ) : (
                <form className="booking-form" onSubmit={handleBookingSubmit}>
                  {user ? (
                    <>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Sending request as <strong>{user.name}</strong> ({user.email})
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <input name="phone" placeholder="Phone Number" required className="input-field" style={{ flex: 1 }} />
                      </div>
                      <input name="date" type="date" required className="input-field" />
                      <textarea name="message" placeholder="Optional message/questions..." className="input-field" rows="3"></textarea>
                      <button type="submit" disabled={user.role !== 'Buyer'} className="btn-primary" style={{ opacity: user.role !== 'Buyer' ? 0.5 : 1 }}>
                        {user.role === 'Buyer' ? 'Confirm Booking Inquiry' : 'Sellers Cannot Book'}
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn-primary" onClick={() => { setSelectedItem(null); setView('auth'); }}>Login to Book</button>
                  )}
                  <button type="button" className="btn-glass" onClick={() => setSelectedItem(null)}>Cancel</button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{ marginTop: '10rem', padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>
        <p>© 2026 AutoX Performance Marketplace. Built with Node.js & React.</p>
      </footer>
    </div>
  );
};

export default App;
