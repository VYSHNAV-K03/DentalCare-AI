import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Profile = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: 'url(https://www.pixelstalk.net/wp-content/uploads/2016/08/Free-Travel-Backgrounds-Download-HD.jpg)', // Replace with your background image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div
        className="card p-4 text-center"
        style={{
          background: 'linear-gradient(135deg,rgb(13, 55, 78) 0%,rgb(134, 198, 225) 100%)', // Gradient background for the card
          color: '#fff', // White text for contrast
          maxWidth: '400px',
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h1 className="mb-4">My Profile</h1>
        <ul className="list-group">
          <li
            className="list-group-item"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent item background
              color: '#fff', // Text color
              border: 'none', // Remove borders
              marginBottom: '8px', // Spacing between items
              borderRadius: '8px',
            }}
          >
            <Link to="/profile/view" className="text-decoration-none text-white">
              View Profile
            </Link>
          </li>
          <li
            className="list-group-item"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              border: 'none',
              marginBottom: '8px',
              borderRadius: '8px',
            }}
          >
            <Link to="/profile/edit" className="text-decoration-none text-white">
              Edit Profile
            </Link>
          </li>
          <li
            className="list-group-item"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              border: 'none',
              marginBottom: '8px',
              borderRadius: '8px',
            }}
          >
            <Link
              to="/profile/previous-travels"
              className="text-decoration-none text-white"
            >
              Previous Travels
            </Link>
          </li>
          <li
            className="list-group-item"
            style={{
              backgroundColor: 'rgba(255, 0, 0, 0.3)', // Light red for Logout
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
            }}
          >
            <Link to="/logout" className="text-decoration-none text-white">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
