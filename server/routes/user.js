const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Package = require('../models/TourPackages');

// Fetch all verified guides
router.get('/guides', async (req, res) => {
    try {
        const guides = await User.find({ role: 'guide', isVerified: true })
            .select('-password') // Exclude password field for security
            .sort({ date: -1 }); // Sort by the newest

        res.json(guides);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Fetch guide's profile by ID
router.get('/:id', async (req, res) => {
    try {
        const guide = await User.findById(req.params.id).select('-password');
        if (!guide || guide.role !== 'guide') {
            return res.status(404).json({ msg: 'Guide not found' });
        }
        res.json(guide);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/tour-packages', async (req, res) => {
    console.log("get packages");
    
    try {
  
      
  
      // Fetch products based on query
      const products = await Package.find()
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  });






module.exports = router;
