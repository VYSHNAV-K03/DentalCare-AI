import React from 'react';
import cover from "../assets/images/cover11.jpg"
import { Link } from 'react-router-dom';

function Cover() {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage:`url(${cover})`, // Replace with your actual image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-center text-white bg-dark bg-opacity-50 p-5 rounded">
        <h1 className="display-4 fw-bold">Welcome to Travel Planner</h1>
        <p className="lead">Your ultimate guide to seamless connections.</p>
        <Link to="/browse-guides">
        <button className="btn btn-primary btn-lg mt-3">Get Started</button>
        </Link>
      </div>
    </div>
  );
}

export default Cover;
