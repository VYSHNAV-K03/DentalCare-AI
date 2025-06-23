import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/cart/bookings/hospital");
        setBookings(res.data.bookings);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Hospital Bookings</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-light">
                <tr>
                  <th>User</th>
                  <th>Package</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.userId?.name || "N/A"}</td>
                      <td>{booking.itemId?.name || "N/A"}</td>
                      <td>
                        {booking.amountPaid} {booking.currency}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            booking.status === "Paid"
                              ? "bg-success"
                              : booking.status === "Failed"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
