import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axiosInstance from "../utils/axiosConfig";
import { api, apiUrl } from "../utils/api";

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axiosInstance.get("/packagemanager/packages");
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  const handleDelete = async (packageId) => {
    try {
      await axiosInstance.delete(`/packagemanager/package/${packageId}`);
      setPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg._id !== packageId)
      );
      alert("Package deleted successfully");
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Failed to delete package");
    }
  };

  const handleShowDetails = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPackage(null);
  };

  return (
    <div className="manage-packages p-4">
      <button
        className="btn btn-secondary mb-3 me-3"
        onClick={() => navigate("/packages/add-package")}
      >
        Add Hospital Package
      </button>
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/packages/bookings")}
      >
        Bookings
      </button>
      <h2>Manage Packages</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            {/* <th>Hospital</th> */}
            {/* <th>Duration</th> */}
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg._id}>
              <td>{pkg.name}</td>
              {/* <td>{pkg.destination}</td> */}
              {/* <td>{pkg.duration}</td> */}
              <td>${pkg.price}</td>
              <td>
                <button
                  className="btn btn-info me-2"
                  onClick={() => handleShowDetails(pkg)}
                >
                  View Details
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(pkg._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPackage && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Package Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Title:</strong> {selectedPackage.name}
            </p>
            {/* <p><strong>Destination:</strong> {selectedPackage.destination}</p> */}
            {/* <p><strong>Duration:</strong> {selectedPackage.duration}</p> */}
            <p>
              <strong>Price:</strong> ${selectedPackage.price}
            </p>
            {/* <p><strong>Verified:</strong> {selectedPackage.isVerified ? 'Yes' : 'No'}</p> */}
            {/* <p><strong>Itinerary:</strong></p> */}
            <ul>
              {selectedPackage.itinerary.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>
              <strong>Included Services:</strong>
            </p>
            <ul>
              {selectedPackage.includedServices.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
            <p>
              <strong>Available Dates:</strong>
            </p>
            <ul>
              {selectedPackage.availableDates.map((date, index) => (
                <li key={index}>{new Date(date).toLocaleDateString()}</li>
              ))}
            </ul>
            {selectedPackage.image && selectedPackage.image.length > 0 && (
              <div>
                <strong>Images:</strong>
                <div>
                  {selectedPackage.image.map((img, index) => (
                    <img
                      key={index}
                      src={`${api + img}`}
                      alt={`Package-${apiUrl + "/" + img}`}
                      style={{ width: "100%", marginBottom: "10px" }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ManagePackages;
