import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance, { base } from "../utils/axiosConfig";
import { api } from "../utils/api";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { calculateSimilarity } from "../../config";

const PackageDetailsPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState(null);
  const [recommendedPackages, setRecommendedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(5);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axiosInstance.get(
          `/packagemanager/packages/${itemId}`
        );
        setPackageDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch package details.");
        setLoading(false);
      }
    };
    const fetchAllPackages = async () => {
      try {
        const response = await axiosInstance.get("/packagemanager/packages");
        console.log("response", response.data);

        return response.data;
      } catch (err) {
        console.error("Failed to fetch all packages", err);
        return [];
      }
    };
    const fetchRecommendedPackages = async () => {
      if (!itemId) return;
      const allPackages = await fetchAllPackages();
      console.log("packageDetails", packageDetails);

      const similarities = allPackages.map((pkg) => ({
        package: pkg,
        score: calculateSimilarity(packageDetails, pkg),
      }));
      similarities.sort((a, b) => b.score - a.score);
      setRecommendedPackages(similarities.slice(1, 6).map((s) => s.package));
    };

    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/review/${itemId}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchReviews();
    fetchPackage();
  }, [itemId]);

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        const response = await axiosInstance.get("/packagemanager/packages");
        console.log("response", response.data);

        return response.data;
      } catch (err) {
        console.error("Failed to fetch all packages", err);
        return [];
      }
    };
    const fetchRecommendedPackages = async () => {
      if (!itemId) return;
      const allPackages = await fetchAllPackages();
      console.log("packageDetails", packageDetails);

      const similarities = allPackages.map((pkg) => ({
        package: pkg,
        score: calculateSimilarity(packageDetails, pkg),
      }));
      similarities.sort((a, b) => b.score - a.score);
      setRecommendedPackages(similarities.slice(1, 6).map((s) => s.package));
    };

    fetchRecommendedPackages();
  }, [itemId, packageDetails]);

  console.log("recommendedPackages", recommendedPackages);

  useEffect(() => {
    if (packageDetails?.destination) {
      fetchWeather(packageDetails.destination);
    }
  }, [packageDetails]);

  const handleSubmitReview = async () => {
    if (!reviewText) return alert("Please enter a review");

    const formData = new FormData();
    formData.append("text", reviewText);
    formData.append("rating", rating);
    if (reviewImage) formData.append("image", reviewImage);

    try {
      await axiosInstance.post(`/review/${itemId}/reviews`, formData);
      setReviewText("");
      setReviewImage(null);
      setRating(5);
      alert("Review submitted!");
      window.location.reload();
    } catch (err) {
      console.error("Error submitting review", err);
      alert("Failed to submit review");
    }
  };
  const fetchWeather = async (location) => {
    setWeatherLoading(true);
    try {
      // Get latitude & longitude from OpenStreetMap API
      const geoResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
      );
      if (geoResponse.data.length === 0) {
        throw new Error("Location not found");
      }
      const { lat, lon } = geoResponse.data[0];

      // Fetch weather from Open-Meteo API
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      setWeather(weatherResponse.data.current_weather);
    } catch (err) {
      console.error(err);
      setWeather(null);
    }
    setWeatherLoading(false);
  };

  const handleBuyNow = () => {
    navigate(`/payment/${itemId}/${packageDetails.price}`);
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (!packageDetails)
    return <div className="text-center">Package not found.</div>;

  return (
    <div className="container my-5 py-2">
      <div className="row justify-content-center">
        {/* Image Carousel */}
        <div className="col-md-6">
          <Carousel fade>
            {packageDetails.image.map((img, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={api + img}
                  alt={`Package image ${index + 1}`}
                  style={{
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Package Details */}
        <div className="col-md-6 mt-4 mt-md-0">
          <div className="card shadow-lg border-light p-4">
            <h2 className="text-primary mb-3">{packageDetails.name}</h2>
            <h4 className="text-success">${packageDetails.price}</h4>

            <div className="mb-3">
              <p>
                <strong>Included Services:</strong>
              </p>
              <ul>
                {packageDetails.includedServices.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <p>
                <strong>Available Dates:</strong>
              </p>
              <ul>
                {packageDetails.availableDates.map((date, index) => (
                  <li key={index}>{new Date(date).toLocaleDateString()}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <p>
                <strong>Description:</strong> {packageDetails.description}
              </p>
            </div>

            {/* Weather Details */}

            {/* Buy Now Button */}
            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-primary btn-lg" onClick={handleBuyNow}>
                Book Now
              </button>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h3>Customer Reviews</h3>
          <ul className="list-group">
            {reviews.map((review, index) => (
              <li key={index} className="list-group-item">
                <strong>{review.text}</strong>
                <p>{"⭐".repeat(review.rating)}</p>
                {review.image && (
                  <img
                    src={base + review.image}
                    alt="Review"
                    style={{ width: "100px", cursor: "pointer" }}
                    onClick={() => setSelectedImage(base + review.image)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Add Review Form */}
        <div className="mt-4">
          <h4>Write a Review</h4>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Share your thoughts"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <label>Rating:</label>
          <select
            className="form-control mb-2"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {"⭐".repeat(num)}
              </option>
            ))}
          </select>
          <input
            type="file"
            className="form-control mt-2"
            accept="image/*"
            onChange={(e) => setReviewImage(e.target.files[0])}
          />
          <button className="btn btn-success mt-2" onClick={handleSubmitReview}>
            Submit Review
          </button>
        </div>
        {/* Image Modal */}
        <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)}>
          <Modal.Body className="text-center">
            {selectedImage && (
              <img src={selectedImage} alt="Enlarged" className="img-fluid" />
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PackageDetailsPage;
