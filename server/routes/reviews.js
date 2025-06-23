const express = require('express');
const multer = require('multer');
const path = require('path');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const bookingpackage = require('../models/bookingpackage');
const Package = require('../models/TourPackages');
const upload = multer({ dest: 'uploads/' }); // Configure file upload

const router = express.Router();


// Get Best and Trending Packages
router.get('/best-trending-packages', async (req, res) => {
  try {
    const packages = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products", // Product collection name (check your DB for accuracy)
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $sort: { 
          averageRating: -1, // Highest rated first
          totalReviews: -1,   // Most reviewed first if ratings are the same
        },
      },
      {
        $limit: 10, // Top 10 trending packages
      },
      {
        $project: {
          _id: 1,
          averageRating: 1,
          totalReviews: 1,
          "productDetails.name": 1,
          "productDetails.price": 1,
          "productDetails.image": 1,
          "productDetails.description": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error("Error fetching best and trending packages:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// POST: Add a review
router.post('/:productId/reviews', auth, upload.single('image'), async (req, res) => {
  try {
    const { text,rating } = req.body;
    const image = req.file ? req.file.path : null;
    const { productId } = req.params;
    const userId = req.user.userId;


    console.log(productId, rating);
    

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }

    // Ensure product exists
    const product = await Package.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newReview = new Review({ userId, productId, text,rating, image });
    await newReview.save();

    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error });
  }
});

// GET: Fetch all reviews for a product
router.get('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate('userId', 'name');
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

module.exports = router;
