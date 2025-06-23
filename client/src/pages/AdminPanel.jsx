import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [guides, setGuides] = useState([]);
  const [hospitals, sethospitals] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null); // State for selected guide
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation

  // Fetch guides
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get('/admin/guides', {
          headers: {
            'x-auth-token': localStorage.getItem('token'), // Add the token for authentication
          },
        });
        setGuides(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch guides');
        setLoading(false);
      }
    };
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('/admin/hospitals', {
          headers: {
            'x-auth-token': localStorage.getItem('token'), // Add the token for authentication
          },
        });
        sethospitals(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch guides');
        setLoading(false);
      }
    };

    fetchHospitals();

    fetchGuides();
  }, []);

  // Handle verification toggle
  const handleVerificationToggle = async (id, isVerified) => {
    try {
      await axios.put(
        `/admin/verify/${id}`,
        {},
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'), // Include token for admin authentication
          },
        }
      );

      // Update the verification status of the guide
      setGuides(
        guides.map((guide) =>
          guide._id === id ? { ...guide, isVerified: !isVerified } : guide
        )
      );
      sethospitals(
        hospitals.map((guide) =>
          guide._id === id ? { ...guide, isVerified: !isVerified } : guide
        )
      );
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update verification status');
    }
  };

  // Show modal with selected guide details
  const handleViewDetails = (guide) => {
    setSelectedGuide(guide);
    setShowModal(true);
  };

  // Handle Delete Guide
  const handleDeleteGuide = async (id) => {
    try {
      await axios.delete(`/admin/delete/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'), // Include token for admin authentication
        },
      });

      // Remove the guide from the state after successful deletion
      setGuides(guides.filter(guide => guide._id !== id));
      sethospitals(hospitals.filter(guide => guide._id !== id));
      setShowDeleteConfirm(false); // Close the delete confirmation
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete guide');
      setShowDeleteConfirm(false); // Close the delete confirmation in case of error
    }
  };

  // Handle Delete Confirmation
  const handleDeleteClick = (guide) => {
    setSelectedGuide(guide);
    setShowDeleteConfirm(true);
  };

  const navigate = useNavigate();





  return (
    <>
    <button className="btn btn-primary mx-3 my-3" onClick={() => navigate('/admin/bookings')}>Bookings</button>
    <div className="container my-5">
      <h2 className="text-center">Admin Panel</h2>

      {/* View Guides Section */}
      <div className="my-4">
        <h3>View Doctors</h3>
        {loading && <p>Loading guides...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && (
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th> 
                <th>Location</th>
                <th>Rate per Hour</th>
                <th>Availability</th>
                <th>Verification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.length > 0 ? (
                guides.map((guide) => (
                  <tr key={guide._id}>
                    <td>
                      <img
                        src={api + guide.profileImage || '/default-profile.png'}
                        alt="Profile"
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    </td>
                    <td>{guide.name}</td>
                    <td>{guide.email}</td>
                    <td>{guide.location || 'N/A'}</td>
                    <td>{guide.ratePerHour ? `$${guide.ratePerHour}` : 'N/A'}</td>
                    <td>{guide.availability ? 'Available' : 'Not Available'}</td>
                    <td>{guide.isVerified ? 'Verified' : 'Pending'}</td>
                    <td>
                      <button
                        className={`btn ${guide.isVerified ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => handleVerificationToggle(guide._id, guide.isVerified)}
                      >
                        {guide.isVerified ? 'Unverify' : 'Verify'}
                      </button>
                      <button
                        className="btn btn-primary ml-2"
                        onClick={() => handleViewDetails(guide)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-danger ml-2"
                        onClick={() => handleDeleteClick(guide)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No guides found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>


      {/* View Guides Section */}
      <div className="my-4">
        <h3>View Hospitals</h3>
        {loading && <p>Loading guides...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && (
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th> 
                <th>Location</th>
                <th>Rate per Hour</th>
                <th>Availability</th>
                <th>Verification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.length > 0 ? (
                hospitals.map((guide) => (
                  <tr key={guide._id}>
                    <td>
                      <img
                        src={api + guide.profileImage || '/default-profile.png'}
                        alt="Profile"
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    </td>
                    <td>{guide.name}</td>
                    <td>{guide.email}</td>
                    <td>{guide.location || 'N/A'}</td>
                    <td>{guide.ratePerHour ? `$${guide.ratePerHour}` : 'N/A'}</td>
                    <td>{guide.availability ? 'Available' : 'Not Available'}</td>
                    <td>{guide.isVerified ? 'Verified' : 'Pending'}</td>
                    <td>
                      <button
                        className={`btn ${guide.isVerified ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => handleVerificationToggle(guide._id, guide.isVerified)}
                      >
                        {guide.isVerified ? 'Unverify' : 'Verify'}
                      </button>
                      <button
                        className="btn btn-primary ml-2"
                        onClick={() => handleViewDetails(guide)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-danger ml-2"
                        onClick={() => handleDeleteClick(guide)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Hospitals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Viewing Details */}
      {showModal && selectedGuide && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
            <img
              src={ api + selectedGuide.profileImage || '/default-profile.png'}
              alt="Profile"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '15px',
              }}
            />
            <h3>{selectedGuide.name}</h3>
            <p><strong>Email:</strong> {selectedGuide.email}</p>
            <p><strong>Location:</strong> {selectedGuide.location || 'N/A'}</p>
            <p><strong>Rate per Hour:</strong> ${selectedGuide.ratePerHour || 'N/A'}</p>
            <p><strong>Availability:</strong> {selectedGuide.availability ? 'Available' : 'Not Available'}</p>
            <p><strong>Verification Status:</strong> {selectedGuide.isVerified ? 'Verified' : 'Pending'}</p>
            <h4>Certificate:</h4>
            {selectedGuide.certificate  ? (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                  <li>
                    <a href={ api + selectedGuide.certificate} target="_blank" rel="noopener noreferrer">
                      View Certificate
                    </a>
                  </li>
              </ul>
            ) : (
              <p>No certificates available</p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedGuide && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '400px',
              textAlign: 'center',
            }}
          >
            <h4>Are you sure you want to delete this guide?</h4>
            <p>{selectedGuide.name}</p>
            <div>
              <button
                className="btn btn-danger mr-2"
                onClick={() => handleDeleteGuide(selectedGuide._id)}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>

  );
};

export default AdminPanel;
