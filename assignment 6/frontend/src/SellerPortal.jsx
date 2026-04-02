import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Phone, Mail, Info, Plus } from 'lucide-react';

const SellerPortal = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchAppointments(), fetchListings()]);
    setLoading(false);
  };

  const fetchListings = async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/listings/seller/${user.id}`);
      setListings(resp.data);
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/seller/appointments/${user.id}`);
      setAppointments(resp.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      price: formData.get('price'),
      category: formData.get('category'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
      sellerId: user.id
    };
    try {
      await axios.post('http://localhost:5000/api/listings', data);
      setShowAddForm(false);
      alert("Listing added successfully!");
      fetchListings(); // Refresh inventory
    } catch (err) {
      alert("Failed to add listing.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: '1000px', margin: '2rem auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem' }}>Seller Dashboard</h2>
          <p style={{ color: 'var(--text-dim)' }}>Manage your listings and viewing requests.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>+ Add New Listing</button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div className="glass-card" style={{ maxWidth: '500px', width: '90%', padding: '2rem' }}>
              <h3>List New Vehicle</h3>
              <form onSubmit={handleAddListing} className="booking-form" style={{ marginTop: '1.5rem', padding: 0 }}>
                <input name="title" placeholder="Vehicle Name (e.g. 2022 BMW X5)" required className="input-field" />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input name="price" type="number" placeholder="Price ($)" required className="input-field" style={{ flex: 1 }} />
                  <select name="category" className="input-field" style={{ flex: 1, background: '#000' }}>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>
                <input name="imageUrl" placeholder="Image URL" required className="input-field" />
                <textarea name="description" placeholder="Description..." required className="input-field" rows="3"></textarea>
                <button type="submit" className="btn-primary">Publish Listing</button>
                <button type="button" className="btn-glass" onClick={() => setShowAddForm(false)}>Cancel</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          My Inventory <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 400 }}>({listings.length} items)</span>
        </h3>
        
        {loading ? (
          <div>Loading inventory...</div>
        ) : listings.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>
            <p>You haven't listed any vehicles yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {listings.map(item => (
              <div key={item._id} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img src={item.imageUrl} alt={item.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{item.title}</h4>
                  <p style={{ margin: '4px 0 0', color: 'var(--primary)', fontSize: '0.9rem' }}>${item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 style={{ marginBottom: '1.5rem' }}>View Requests (Enquiries)</h3>

      {loading ? (
        <div>Loading enquiries...</div>
      ) : appointments.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <Info size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--text-dim)' }} />
          <h3>No inquiries yet</h3>
          <p style={{ color: 'var(--text-dim)' }}>New requests will appear here when buyers express interest.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
          {appointments.map(app => (
            <div key={app._id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <img src={app.listingId?.imageUrl} alt={app.listingId?.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px' }} />
                <div>
                  <h4 style={{ color: 'var(--primary)' }}>{app.listingId?.title}</h4>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                    <Calendar size={14} /> {new Date(app.appointmentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <hr style={{ margin: '1.2rem 0', borderColor: 'var(--glass-border)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={16} /> {app.customerName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} /> {app.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={16} /> {app.phone}
                </div>
              </div>
              {app.message && (
                <div style={{ marginTop: '1.2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', fontSize: '0.85rem' }}>
                  "{app.message}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SellerPortal;
