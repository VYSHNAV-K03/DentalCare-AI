import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig'; // Import Axios instance
import { useNavigate } from 'react-router-dom';

const GuideRegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
        ratePerHour: '',
        availability: true,
    });

    const [profileImage, setProfileImage] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [message, setMessage] = useState('');

    // Handle input change for text and checkbox fields
    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle file input change
    const onFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'profileImage') {
            setProfileImage(files[0]);
        } else if (name === 'certificate') {
            setCertificate(files[0]);
        }
    };

    const navigate = useNavigate()

    // Handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        if (profileImage) {
            formDataToSend.append('profileImage', profileImage);
        }
        if (certificate) {
            formDataToSend.append('certificate', certificate);
        }

        try {
            const res = await axiosInstance.post('/auth/register-guide', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(res.data.msg); // Success message
            setTimeout(() => navigate("/login"), 1200);
            // navigate("/login")
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Server error');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
            <h2>Doctor Registration</h2>
            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={onChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Rate Per Hour:</label>
                    <input
                        type="number"
                        name="ratePerHour"
                        value={formData.ratePerHour}
                        onChange={onChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Profile Image:</label>
                    <input
                        type="file"
                        name="profileImage"
                        onChange={onFileChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Certificate:</label>
                    <input
                        type="file"
                        name="certificate"
                        onChange={onFileChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                {message && <p style={{ color: 'red' }}>{message}</p>}

                <button
                    type="submit"
                    style={{ padding: '10px 20px', backgroundColor: '#00B98E', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default GuideRegisterForm;
