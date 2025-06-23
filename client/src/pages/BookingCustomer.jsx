import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [packageBookings, setPackageBookings] = useState([]);
  const [guidebookings, setguidebookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [user, setuser] = useState(JSON.parse(localStorage.getItem("user")));

  const navigate = useNavigate();

  console.log("unreadCounts", unreadCounts["681f8726d7e6c5f6add355e8"]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get("/cart/bookings"); // Fetch tour package bookings
        setPackageBookings(response.data.bookings);
        fetchUnreadCounts();

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const fetchUnreadCounts = async () => {
    try {
      const response = await axiosInstance.get(
        `/auth/chat/unread/count/${user._id}`
      );
      setUnreadCounts(response.data);
    } catch (err) {
      console.error("Error fetching unread counts", err);
    }
  };

  console.log("packageBookings", packageBookings);
  console.log("guidebookings", guidebookings);

  // Function to cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await axiosInstance.patch(`/cart/bookings/${bookingId}/cancel`); // Update booking status
      setPackageBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );
      alert("Booking has been cancelled.");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking.");
    }
  };

  useEffect(() => {
    const fetchBookingsGuide = async () => {
      try {
        const response = await axiosInstance.get("/cart/bookings/guide"); // Fetch tour package bookings
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

  console.log("packageBookings", packageBookings);

  // Function to cancel booking
  const handleCancelBookingGuide = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await axiosInstance.patch(`/cart/bookings/${bookingId}/cancel/guide`); // Update booking status
      setguidebookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );
      alert("Booking has been cancelled.");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking.");
    }
  };
  const handleChat = (guideId) => {
    navigate(`/chat/${guideId}`);
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Doctor Appointments</h2>

      {guidebookings.length === 0 ? (
        <div className="text-center">
          <p>You have no bookings yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Booking ID</th>
                <th>Doctor Name</th>
                <th>Location</th>
                <th>Price</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Action</th>
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
                  <td>
                    {booking.status !== "Cancelled" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelBookingGuide(booking._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                  <td>
                    {booking.status !== "Cancelled" && (
                      <button
                        className="btn btn-primary position-relative btn-sm"
                        onClick={() => handleChat(booking.guideid?._id)}
                      >
                        Chat
                        {unreadCounts[booking.guideid?._id] > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {unreadCounts[booking.guideid?._id]}
                          </span>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-4">My Hospital Package Bookings</h2>
      {packageBookings.length === 0 ? (
        <div className="text-center">
          <p>You have no hospital package bookings yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Booking ID</th>
                <th>Package Name</th>
                <th>Price</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {packageBookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{index + 1}</td>
                  <td>{booking._id}</td>
                  <td>{booking.itemId?.name}</td>
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
                  <td>
                    {booking.status !== "Cancelled" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
