const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Route to fetch all guides (admin only)
router.get('/guides', authMiddleware, async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        // Fetch all guides
        const guides = await User.find({ role: 'guide' });
        res.json(guides);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/hospitals', authMiddleware, async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        // Fetch all guides
        const guides = await User.find({ role: 'packagemanger' });
        res.json(guides);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to verify/unverify a guide (admin only)
router.put('/verify/:id', authMiddleware, async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        // Find the guide by ID
        const guide = await User.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({ msg: 'Guide not found' });
        }

        // Toggle the `isVerified` field
        guide.isVerified = !guide.isVerified;
        await guide.save();

        res.json({ msg: `${guide.isVerified ? 'verified' : 'unverified'}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to delete a guide (admin only)
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        // Find the guide by ID and delete it
        const guide = await User.findByIdAndDelete(req.params.id);
        if (!guide) {
            return res.status(404).json({ msg: 'Guide not found' });
        }

        res.json({ msg: 'Deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
