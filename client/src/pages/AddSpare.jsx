import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../utils/axiosConfig';

const AddPackage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [includedServices, setIncludedServices] = useState('');
  const [availableDates, setAvailableDates] = useState([]); // Store selected dates as an array
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleDateChange = (date) => {
    if (date) {
      setAvailableDates((prevDates) => [...prevDates, date]); // Add new date to the array
    }
  };

  const removeDate = (index) => {
    setAvailableDates((prevDates) => prevDates.filter((_, i) => i !== index)); // Remove selected date
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('destination', destination);
    formData.append('duration', duration);
    formData.append('itinerary', JSON.stringify(itinerary.split(',')));
    formData.append('includedServices', JSON.stringify(includedServices.split(',')));
    formData.append('availableDates', JSON.stringify(availableDates)); // Convert dates to JSON
    
    images.forEach((img) => formData.append('image', img));

    try {
      const res = await axiosInstance.post('/packagemanager/package', formData);
      console.log(res.data);
      alert('Package added successfully!');
      navigate('/package-panel');
    } catch (err) {
      console.error('Error adding Package:', err);
      alert('Failed to add Package.');
    }
  };

  return (
    <div className="add-package container my-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/package-panel')}>
        Back to Dashboard
      </button>
      <h2>Add Hospital Package</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Package Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        {/* <div className="mb-3">
          <label className="form-label">Destination</label>
          <input type="text" className="form-control" value={destination} onChange={(e) => setDestination(e.target.value)} required />
        </div> */}
        {/* <div className="mb-3">
          <label className="form-label">Duration</label>
          <input type="text" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} required />
        </div> */}
        {/* <div className="mb-3">
          <label className="form-label">Itinerary (comma-separated)</label>
          <input type="text" className="form-control" value={itinerary} onChange={(e) => setItinerary(e.target.value)} required />
        </div> */}
        <div className="mb-3">
          <label className="form-label">Included Services (comma-separated)</label>
          <input type="text" className="form-control" value={includedServices} onChange={(e) => setIncludedServices(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Available Dates</label>
          <DatePicker
            selected={null} // Do not pre-select any date
            onChange={handleDateChange}
            minDate={new Date()} // Disable past dates
            className="form-control"
            placeholderText="Select Available Date"
          />
          <div className="mt-2">
            {availableDates.length > 0 &&
              availableDates.map((date, index) => (
                <div key={index} className="d-flex align-items-center">
                  <span className="me-2">{date.toDateString()}</span>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeDate(index)}>Remove</button>
                </div>
              ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Images</label>
          <input type="file" className="form-control" multiple onChange={handleImageChange} />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">Add Package</button>
        </div>
      </form>
    </div>
  );
};

export default AddPackage;
