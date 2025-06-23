import React, { useState } from 'react';
import axios from '../utils/axiosConfig'; // Import the configured axios instance
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post('/auth/register', formData); // Base URL is already configured
      setMessage('Registration successful! Please log in.');
      setFormData({ name: '', email: '', password: '' }); // Reset form
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong.');
    }
  };

  const handleGuideSignup = () => {
    navigate('/signup-guide'); // Adjust the path as per your routing
  };

  const handlePackageSignup = () => {
    navigate('/signup-package'); // Adjust the path as per your routing
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Signup</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3">Signup</button>
      </form>
      <div className="text-center mt-4">
        <button
          className="btn btn-outline-success btn-lg"
          onClick={handleGuideSignup}
          style={{
            fontWeight: 'bold',
            borderRadius: '30px',
            padding: '10px 20px',
          }}
        >
          Create Doctor Account
        </button>
      </div>
      <div className="text-center mt-4">
        <button
          className="btn btn-outline-success btn-lg"
          onClick={handlePackageSignup}
          style={{
            fontWeight: 'bold',
            borderRadius: '30px',
            padding: '10px 20px',
          }}
        >
          Create Hospital Account
        </button>
      </div>
    </div>
  );
};

export default Signup;
