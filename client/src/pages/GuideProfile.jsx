import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { api } from "../utils/api";

const DoctorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ date: "", time: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setProfile(response.data);
        setFormData(response.data);
        setSchedule(response.data.schedule || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScheduleChange = (e) => {
    setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put("/auth/update-profile", formData);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedSchedule = [...schedule, newSchedule];
      await axiosInstance.put("/auth/update-schedule", { schedule: updatedSchedule });
      setSchedule(updatedSchedule);
      setNewSchedule({ date: "", time: "" });
    } catch (err) {
      setError("Failed to update schedule. Please try again.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Doctor Profile</h1>
      {profile && (
        <div className="card shadow-lg p-4 border-0 rounded">
          <div className="card-body text-center">
            <img
              src={api + profile.profileImage || "https://via.placeholder.com/150"}
              alt={profile.name}
              className="img-fluid rounded-circle mb-3 border border-secondary"
              style={{ width: "150px", height: "150px" }}
            />
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    className="form-control"
                    name="specialization"
                    value={formData.specialization || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-success me-2">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3 className="mb-3">{profile.name}</h3>
                <p>Email: {profile.email}</p>
                <p>Specialization: Dental</p>
                <p>Location: {profile.location || "Not specified"}</p>
                <p>Fee: {profile.ratePerHour}</p>

                {/* <button className="btn btn-primary mt-3" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button> */}
              </>
            )}
          </div>
        </div>
      )}

      {/* Schedule Section */}
      <div className="card shadow-lg p-4 border-0 rounded mt-4">
        <div className="card-body">
          <h2 className="text-center mb-4">Available Schedule</h2>
          <ul className="list-group">
            {schedule.length > 0 ? (
              schedule.map((slot, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between">
                  {slot.date} - {slot.time}
                </li>
              ))
            ) : (
              <p className="text-center">No available schedule</p>
            )}
          </ul>

          <form onSubmit={handleScheduleSubmit} className="mt-4">
            <div className="row g-3">
              <div className="col-md-5">
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={newSchedule.date}
                  onChange={handleScheduleChange}
                  required
                />
              </div>
              <div className="col-md-5">
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={newSchedule.time}
                  onChange={handleScheduleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-success w-100">Add</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
