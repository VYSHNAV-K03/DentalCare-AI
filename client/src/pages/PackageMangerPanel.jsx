// src/pages/GuidePanel.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PackageManagerPanel = () => {
  return (
    <div className="supplier-dashboard">
      <h2>Package Manager Dashboard</h2>
      <div className="dashboard-links">
        <Link to="/supplier/add-product" className="btn btn-primary mx-2 my-2">Add Vehicles</Link>
        <Link to="/supplier/products" className="btn btn-primary mx-2 my-2">Manage Vehicles</Link>
        <Link to="/supplier/add-spare" className="btn btn-primary mx-2 my-2">Add Spare Parts</Link>
        <Link to="/supplier/spare" className="btn btn-primary mx-2 my-2">Manage Spare Parts</Link>

      </div>
    </div>
  );
};

export default PackageManagerPanel;
