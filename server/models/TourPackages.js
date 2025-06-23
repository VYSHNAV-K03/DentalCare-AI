const mongoose = require("mongoose");

const packageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: [String], // Array of image URLs
    },
    destination: {
      type: String,
    },
    duration: {
      type: String, // Example: "5 Days 4 Nights"
    },
    itinerary: {
      type: [String], // Array of itinerary details for each day
    },
    includedServices: {
      type: [String], // Example: ["Hotel", "Meals", "Transport", "Guide"]
      required: true,
    },
    availableDates: {
      type: [Date], // Array of available start dates
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isVerified: { type: Boolean, default: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
