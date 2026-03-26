import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Compass, MapPin, Mail, Settings, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const App = () => {
  const [destinations, setDestinations] = useState([]);
  const [inquiry, setInquiry] = useState({ name: '', email: '', destination: '', message: '' });
  const [inquiries, setInquiries] = useState([]); // For admin view demo
  const [view, setView] = useState('home'); // 'home' or 'admin'
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchDestinations();
    if (view === 'admin') fetchAdminData();
  }, [view]);

  const fetchDestinations = async () => {
    try {
      const res = await axios.get(`${API_URL}/destinations`);
      setDestinations(res.data);
    } catch (err) {
      console.error("API Fetch Error:", err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/inquiries`);
      setInquiries(res.data);
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/inquiry`, inquiry);
      setStatus('✅ Success! Your inquiry has been sent.');
      setInquiry({ name: '', email: '', destination: '', message: '' });
      setTimeout(() => setStatus(''), 5000);
    } catch (err) {
      setStatus('❌ Error: Could not send inquiry.');
    }
  };

  return (
    <div>
      <nav>
        <div className="logo" onClick={() => setView('home')}>Vagabond</div>
        <div className="nav-links">
          <a href="#home" onClick={() => setView('home')}>Home</a>
          <a href="#destinations" onClick={() => setView('home')}>Destinations</a>
          <a href="#contact" onClick={() => setView('home')}>Connect</a>
          <a href="#admin" onClick={() => setView('admin')}>Admin Portal</a>
        </div>
        <div className="nav-icons" style={{ display: 'flex', gap: '20px' }}>
          <Settings size={20} className="logo" onClick={() => setView('admin')} style={{ cursor: 'pointer' }} />
        </div>
      </nav>

      {view === 'home' ? (
        <main>
          {/* Hero */}
          <header id="home" className="hero">
            <Compass size={48} color="var(--primary)" />
            <h1>Escape Local. Live Global.</h1>
            <p style={{ letterSpacing: '5px', fontWeight: '300', color: '#b0b0b0' }}>LUXURY CURATED EXPERIENCES WORLDWIDE</p>
            <div style={{ marginTop: '2rem' }}>
              <a href="#destinations" className="cta-btn">Browse Collections</a>
            </div>
          </header>

          {/* Destinations Grid */}
          <section id="destinations">
            <h2 className="section-title">Curated Destinations</h2>
            <div className="dest-grid">
              {destinations.map((dest, idx) => (
                <div key={idx} className="dest-card">
                  <img src={dest.image} alt={dest.name} className="dest-img" />
                  <div className="dest-info">
                    <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>{dest.name}</h3>
                    <p style={{ color: '#b0b0b0', marginBottom: '20px', fontSize: '15px' }}>{dest.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent)' }}>${dest.price}</span>
                      <a href="#contact" className="cta-btn" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem', borderRadius: '10px' }}>Book Exclusive</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Inquiry Form */}
          <section id="contact" style={{ background: '#0d121b' }}>
            <h2 className="section-title">Plan Your Vision</h2>
            <div className="contact-card">
              {status && <div style={{ marginBottom: '2rem', textAlign: 'center', transition: '0.5s' }}>{status}</div>}
              <form onSubmit={handleInquirySubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <input 
                        type="text" placeholder="Full Name" required 
                        value={inquiry.name} onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })} 
                    />
                    <input 
                        type="email" placeholder="Email Address" required 
                        value={inquiry.email} onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })} 
                    />
                </div>
                <select 
                    required value={inquiry.destination} 
                    onChange={(e) => setInquiry({ ...inquiry, destination: e.target.value })}
                >
                    <option value="" disabled>Select a Destination</option>
                    {destinations.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
                    <option value="Custom">Custom Inquiry</option>
                </select>
                <textarea 
                    placeholder="Tell us about your dream vision for this journey..." rows="6" required 
                    value={inquiry.message} onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                />
                <button type="submit" className="cta-btn" style={{ width: '100%', padding: '1.4rem' }}>Request Concierge Access</button>
              </form>
            </div>
          </section>
        </main>
      ) : (
        <section style={{ paddingTop: '150px' }}>
          <h2 className="section-title">Admin Command Center</h2>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: 'var(--glass-bg)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: '#b0b0b0', textTransform: 'uppercase', fontSize: '12px' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Client</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Target</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Vision Statement</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>{inq.name}</td>
                      <td style={{ padding: '1rem' }}>{inq.email}</td>
                      <td style={{ padding: '1rem', color: 'var(--accent)' }}>{inq.destination}</td>
                      <td style={{ padding: '1rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inq.message}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#b0b0b0', fontSize: '13px' }}>{new Date(inq.date).toDateString()}</td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#b0b0b0' }}>No inquiries received yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <footer style={{ padding: '4rem 8rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
        <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>&copy; 2026 Vagabond Journeys Overseas. Luxury Redefined.</p>
      </footer>
    </div>
  );
};

export default App;
