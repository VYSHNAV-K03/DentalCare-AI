import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const BookingPageGuide = () => {
  const [guidebookings, setguidebookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const navigate = useNavigate();
  const [user, setuser] = useState(JSON.parse(localStorage.getItem("user")));

  console.log("guidebookings", guidebookings);
  console.log("user", user);
  console.log("unreadCounts", unreadCounts);

  // Function to fetch unread chat counts
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

  useEffect(() => {
    const fetchBookingsGuide = async () => {
      try {
        const response = await axiosInstance.get("/cart/bookings/guidepanel");
        setguidebookings(response.data.bookings);
        setLoading(false);
        fetchUnreadCounts();
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings.");
        setLoading(false);
      }
    };

    fetchBookingsGuide();
  }, []);

  const handleChat = (guideId) => {
    navigate(`/chat/${guideId}`);
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      {guidebookings.length === 0 ? (
        <div className="text-center">
          <p>You have no guide bookings yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Booking ID</th>
                <th>User Name</th>
                <th>Contact</th>
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
                  <td>{booking.userId?.name}</td>
                  <td>{booking.userId?.email}</td>
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
                        className="btn btn-primary btn-sm position-relative"
                        onClick={() => handleChat(booking.userId?._id)}
                      >
                        Chat
                        {unreadCounts[booking.userId?._id] > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {unreadCounts[booking.userId?._id]}
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
    </div>
  );
};

export default BookingPageGuide;
