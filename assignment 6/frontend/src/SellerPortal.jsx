import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, Mail, Info } from 'lucide-react';

const SellerPortal = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: '1000px', margin: '2rem auto' }}
    >
      <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Seller Dashboard</h2>
      <p style={{ color: 'var(--text-dim)', marginBottom: '3rem' }}>Review viewing requests from prospective buyers.</p>

      {loading ? (
        <div>Loading your schedule...</div>
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
