import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { api } from "../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const BrowseGuides = () => {
  // State for guides, search input, and modal
  const [guides, setGuides] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null); // Track the selected guide

  console.log(selectedGuide);

  const navigate = useNavigate();

  // Fetch guides from the backend
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axiosInstance.get("/users/guides");
        setGuides(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load guides. Please try again later.");
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  // Filter guides by location
  const filteredGuides = guides.filter((guide) =>
    guide.location?.toLowerCase().includes(searchLocation.toLowerCase())
  );

  // Function to open the modal
  const openModal = (guide) => {
    setSelectedGuide(guide);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedGuide(null);
  };

  const handleEnroll = () => {
    navigate(`/paymentguide/${id}/${course.fee}`); // Navigate to payment page
  };

  // Conditional rendering for loading and error states
  if (loading) {
    return <p className="text-center my-5">Loading guides...</p>;
  }

  if (error) {
    return <p className="text-center text-danger my-5">{error}</p>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Browse Doctors</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
      </div>

      {/* Guides Grid */}
      <div className="row">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((guide) => (
            <div className="col-md-4 mb-4" key={guide._id}>
              <div className="card h-100">
                <img
                  src={
                    api + guide.profileImage ||
                    "https://via.placeholder.com/150"
                  }
                  className="card-img-top"
                  alt={guide.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{guide.name}</h5>
                  <p className="card-text">
                    Location: {guide.location || "Not specified"}
                  </p>
                  <p className="card-text">
                    Fee per Hour: ${guide.ratePerHour || "N/A"}
                  </p>
                  <p className="card-text">
                    Available: {guide.availability ? "Yes" : "No"}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => openModal(guide)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted">
              No guides found for the entered location.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedGuide && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">Doctor Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <img
                  src={
                    api + selectedGuide.profileImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt={selectedGuide.name}
                  className="img-fluid mb-3"
                />
                <h5>{selectedGuide.name}</h5>
                <p>
                  <strong>Location:</strong>{" "}
                  {selectedGuide.location || "Not specified"}
                </p>
                <p>
                  <strong>Fee:</strong> ${selectedGuide.ratePerHour || "N/A"}
                </p>

                <p>
                  <strong>Specialization:</strong>{" "}
                  {selectedGuide.specialization || "Dental"}
                </p>
                <p>
                  <strong>Availability:</strong>{" "}
                  {selectedGuide.availability ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Available Schedule:</strong>{" "}
                  {selectedGuide.schedule.length > 0 ? (
                    selectedGuide.schedule.map((slot, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between"
                      >
                        {slot.date} - {slot.time}
                      </li>
                    ))
                  ) : (
                    <p className="text-center">No available schedule</p>
                  )}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    navigate(
                      `/paymentguide/${selectedGuide._id}/${selectedGuide.ratePerHour}`
                    );
                  }}
                >
                  Book Now
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseGuides;
