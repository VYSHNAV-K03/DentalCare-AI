import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams for accessing route params
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../utils/axiosConfig";

const PaymentTest = () => {
  const { guideid, fee } = useParams(); // Fetch courseId and fee from the URL params
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  console.log("fee", fee);
  
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true); // Start loading state
    try {
      // Send payment details to the backend
      const response = await axiosInstance.post(
        "/payments/verify-payment",
        {
          guideid,
          amount: fee, // Pass the fee from URL params
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"), // Add token in header
          },
        }
      );

      // Handle success response
      if (response.data.success) {
        setMessage("Payment verified and enrollment successful!");
        closeModal();
        setTimeout(() => navigate("/bookings"), 1000);
      } else {
        setMessage("Payment verification failed.");
      }
    } catch (error) {
      console.error("Error during payment verification:", error);
      setMessage("An error occurred during payment verification.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="container mt-5">
      {/* Display Course Details */}
      <div className="card p-3 mb-4">
        <h5 className="card-title">Payment Details</h5>
        <p className="card-text">
          <strong>Doctor ID:</strong> {guideid}
        </p>
        <p className="card-text">
          <strong>Fee:</strong> ₹{fee}
        </p>
      </div>

      {/* Payment Gateway Button */}
      <button className="btn btn-primary" onClick={openModal}>
        Open Payment Gateway
      </button>

      {/* Display Response Message */}
      {message && (
        <div
          className={`alert mt-3 ${
            message.includes("successful") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "500px" }}
          >
            <div
              className="modal-content"
              style={{ borderRadius: "10px", padding: "20px" }}
            >
              {/* Modal Header */}
              <div className="modal-header border-0">
                <h5 className="modal-title">Payment Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {/* Payment Method Tabs */}
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button
                      className="nav-link active"
                      data-bs-toggle="tab"
                      role="tab"
                      style={{ border: "none", color: "#007bff" }}
                    >
                      Card
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      role="tab"
                      style={{ border: "none" }}
                    >
                      Bancontact
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      role="tab"
                      style={{ border: "none" }}
                    >
                      iDEAL
                    </button>
                  </li>
                </ul>

                {/* Card Payment Form */}
                <form>
                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardNumber"
                      placeholder="1234 1234 1234 1234"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="expiry" className="form-label">
                        Expiry
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="expiry"
                        placeholder="MM / YY"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cvc" className="form-label">
                        CVC
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cvc"
                        placeholder="CVC"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <select className="form-select" id="country">
                      <option value="United States">United States</option>
                      <option value="India">India</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="zip" className="form-label">
                      ZIP
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip"
                      placeholder="90210"
                    />
                  </div>
                  <small className="text-muted">
                    By providing your card information, you allow MiniMall to
                    charge your card for future payments in accordance with
                    their terms.
                  </small>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-0">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay Now ₹${fee}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTest;
