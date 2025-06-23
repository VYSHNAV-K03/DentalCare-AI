import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { api, apiUrl } from '../utils/api';

const AuthenticatedUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch authenticated user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/me'); // Endpoint for authenticated user's profile
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  console.log(profile);
  

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">My Profile</h1>
      {profile && (
        <div className="card">
          <div className="card-body text-center">
            <img
              src={api + profile.profileImage || 'https://via.placeholder.com/150'}
              alt={profile.name}
              className="img-fluid rounded-circle mb-3"
              style={{ width: '150px' }}
            />
            <h3>{profile.name}</h3>
            <p>Email: {profile.email}</p>
            <p>Role: {profile.role}</p>
            <p>Location: {profile.location || 'Not specified'}</p>
            <p>Rate per Hour: ${profile.ratePerHour || 'N/A'}</p>
            <p>Availability: {profile.availability ? 'Yes' : 'No'}</p>
            <p>Joined: {new Date(profile.date).toLocaleDateString()}</p>
            <button className="btn btn-primary mt-3">Edit Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticatedUserProfile;
