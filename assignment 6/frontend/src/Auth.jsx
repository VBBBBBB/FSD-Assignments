import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Buyer' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const resp = await axios.post(`http://localhost:5000${endpoint}`, formData);
      localStorage.setItem('user', JSON.stringify(resp.data.user));
      localStorage.setItem('token', resp.data.token);
      onAuthSuccess(resp.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card" 
      style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{isLogin ? 'Welcome Back' : 'Join AutoX'}</h2>
      {error && <p style={{ color: '#ff4d4f', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && (
          <>
            <input 
              name="name" placeholder="Full Name" required className="input-field"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <select 
              className="input-field" style={{ width: '100%', background: '#000' }}
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>
          </>
        )}
        <input 
          name="email" type="email" placeholder="Email" required className="input-field" 
          value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          name="password" type="password" placeholder="Password" required className="input-field" 
          value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"} 
        <span 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ color: 'var(--primary)', cursor: 'pointer', marginLeft: '0.5rem' }}
        >
          {isLogin ? 'Register' : 'Login'}
        </span>
      </p>
    </motion.div>
  );
};

export default Auth;
