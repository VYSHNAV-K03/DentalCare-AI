import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const BookingPageAdmin = () => {
  const [packageBookings, setPackageBookings] = useState([]);
  const [guidebookings, setguidebookings] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get("/cart/bookings/admin"); // Fetch tour package bookings
        setPackageBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchBookingsGuide = async () => {
      try {
        const response = await axiosInstance.get("/cart/bookings/admin/guide"); // Fetch tour package bookings
        setguidebookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings.");
        setLoading(false);
      }
    };

    fetchBookingsGuide();
  }, []);
  const navigate = useNavigate();

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  console.log(packageBookings);
  



  return (
    <>
    <button className="btn btn-primary mx-3" onClick={() => navigate('/admin')}>Back</button>
    
    <div className="container mt-5">
      <h2 className="mb-4">Package Bookings</h2>

      {packageBookings.length === 0 ? (
        <div className="text-center">
          <p>You have no tour package bookings yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Booking ID</th>
                <th>User</th>
                <th>Package Name</th>
                <th>Destination</th>
                <th>Price</th>
                <th>Booking Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {packageBookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{index + 1}</td>
                  <td>{booking._id}</td>
                  <td>{booking.userId?.name}</td>
                  <td>{booking.itemId?.name}</td>
                  <td>{booking.itemId?.destination}</td>
                  <td>${booking.itemId?.price}</td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        booking.status === "Confirmed"
                        ? "bg-success"
                        : booking.status === "Pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       <h2 className="mb-4">Guide Bookings</h2>

{guidebookings.length === 0 ? (
  <div className="text-center">
    <p>You have no tour package bookings yet.</p>
  </div>
) : (
  <div className="table-responsive">
    <table className="table table-striped table-bordered">
      <thead>
      <tr>
          <th>#</th>
          <th>Booking ID</th>
          <th>Guide Name</th>
          <th>Destination</th>
          <th>Price</th>
          <th>Booking Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {guidebookings.map((booking, index) => (
          <tr key={booking._id}>
            <td>{index + 1}</td>
            <td>{booking._id}</td>
            <td>{booking.guideid?.name}</td>
            <td>{booking.guideid?.location}</td>
            <td>${booking.amountPaid}</td>
            <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
            <td>
              <span
                className={`badge ${
                  booking.status === "Confirmed"
                    ? "bg-success"
                    : booking.status === "Pending"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }`}
              >
                {booking.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>
      </>
  );
};

export default BookingPageAdmin;
