import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig'; // Import the global Axios instance

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      const response = await axiosInstance.post('/auth/login', formData);
      
      console.log(response.data);
      
      // Simulate storing the token in localStorage (you can also use cookies)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Set message for successful login
      setMessage('Login successful! Redirecting...');
      setFormData({ email: '', password: '' }); // Reset form

      // Check role from the response and redirect accordingly
      const userRole = response.data.role;

      console.log(response.data);
      

      setTimeout(() => {
        if (userRole === 'admin') {
          window.location.href = '/admin'; // Redirect to admin panel
        }
        else if (userRole === 'guide') {
          window.location.href = '/guide_profile'; // Redirect to guide dashboard
        }
        else if (userRole === 'packagemanger') {
          window.location.href = '/package-panel'; // Redirect to user dashboard
        }
         else {
          window.location.href = '/'; // Redirect to default dashboard or home
        }
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid credentials, please try again.');
    }
};


  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Login</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
