import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

const TourPackages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  console.log("packages", packages);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axiosInstance.get(
          "/packagemanager/packages/user"
        );

        const data = await response.data;
        setPackages(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const filteredPackages = packages.filter((pkg) =>
    `${pkg.name} ${pkg.destination}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleCustomOrderClickCar = (car) => {
    navigate(`/item/${car._id}`);
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{ textAlign: "center", marginBottom: "2rem", color: "#007bff" }}
      >
        Explore India: Tour Packages
      </h1>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Search for destinations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "60%",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#777" }}>
          Loading packages...
        </p>
      ) : error ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "red" }}>
          {error}
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  padding: "1rem",
                  border: "1px solid #ddd",
                }}
              >
                {pkg.image && pkg.image.length > 0 && (
                  <img
                    src={api + pkg.image[0]} // Display the first image
                    alt={pkg.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                )}
                <h3>{pkg.name}</h3>
                <p style={{ color: "#555" }}>{pkg.destination}</p>
                <p>
                  <span style={{ fontWeight: "bold", color: "#007bff" }}>
                    From ₹{pkg.price}
                  </span>
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>
                    Hospital: {pkg.supplier?.name}
                  </span>
                </p>
                <button
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  View Details
                </button>
                <button
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    padding: "10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCustomOrderClickCar(pkg)}
                >
                  Book Now
                </button>
              </div>
            ))
          ) : (
            <p
              style={{ textAlign: "center", fontSize: "1.2rem", color: "#777" }}
            >
              No packages found
            </p>
          )}
        </div>
      )}

      {selectedPackage && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "30%",
            width: "40%",
            background: "white",
            padding: "20px",
            boxShadow: "0 0 10px gray",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
          <h2>{selectedPackage.name}</h2>
          <p>
            <strong>Destination:</strong> {selectedPackage.destination}
          </p>
          <p>
            <strong>Price:</strong> ₹{selectedPackage.price}
          </p>
          <p>{selectedPackage.description}</p>

          <h4>Included Services:</h4>
          <ul>
            {selectedPackage.includedServices.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
          <h4>Available Dates:</h4>
          <ul>
            {selectedPackage.availableDates.map((date, index) => (
              <li key={index}>{new Date(date).toLocaleDateString()}</li>
            ))}
          </ul>
          <button
            onClick={() => setSelectedPackage(null)}
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TourPackages;
