// routes/cart.js
const express = require("express");
const bookingpackage = require("../models/bookingpackage");
const auth = require("../middleware/auth");
const enrollmentModel = require("../models/enrollmentModel");
const router = express.Router();

router.get("/bookings", auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Retrieve authenticated user ID from middleware
    const bookings = await bookingpackage
      .find({ userId })
      .populate("itemId")
      .populate("userId"); // Populate item details
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings", error });
  }
});

router.get("/bookings/hospital", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Fetching bookings for hospital user:", userId);

    // Step 1: Get all bookings with itemId populated
    const allBookings = await bookingpackage
      .find()
      .populate("itemId") // Ensure itemId is populated so we can access supplier
      .populate("userId");

    // Step 2: Filter bookings where itemId.supplier === userId
    const filteredBookings = allBookings.filter(
      (booking) => booking.itemId?.supplier.toString() === userId.toString()
    );

    console.log("Filtered bookings:", filteredBookings);

    res.status(200).json({ success: true, bookings: filteredBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
});

router.get("/bookings/admin", auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Retrieve authenticated user ID from middleware
    const bookings = await bookingpackage
      .find()
      .populate("itemId")
      .populate("userId"); // Populate item details
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings", error });
  }
});

// Cancel booking route
router.patch("/bookings/:id/cancel", async (req, res) => {
  try {
    const booking = await bookingpackage.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

router.get("/bookings/guide", auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Retrieve authenticated user ID from middleware
    const bookings = await enrollmentModel
      .find({ userId })
      .populate("guideid")
      .populate("userId"); // Populate item details
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings", error });
  }
});

router.get("/bookings/guidepanel", auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Retrieve authenticated user ID from middleware
    const bookings = await enrollmentModel
      .find({ guideid: userId })
      .populate("guideid")
      .populate("userId"); // Populate item details
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings", error });
  }
});

router.get("/bookings/admin/guide", auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Retrieve authenticated user ID from middleware
    const bookings = await enrollmentModel
      .find()
      .populate("guideid")
      .populate("userId"); // Populate item details
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings", error });
  }
});

// Cancel booking route
router.patch("/bookings/:id/cancel/guide", async (req, res) => {
  try {
    const booking = await enrollmentModel.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

module.exports = router;
