import React, { useEffect } from 'react';
import axios from 'axios';
import backgroundImage from '../assets/landing.jpg'


const Home = () => {
 

  return (
    
    <div
    className="d-flex justify-content-center align-items-center text-center"
    style={{ backgroundImage: `url("${backgroundImage}")`, backgroundSize: 'cover',height: '92%' ,color: 'white' }}
  >
    <div>
      <h1 className="display-4 fw-bold">DENTAL CARE AI</h1>
      <p className="">
      Welcome to DENTAL CARE AI, your trusted platform for health monitoring using AI technology.
      </p>
    </div>
  </div>
  );
};

export default Home;
