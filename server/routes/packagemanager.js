const express = require("express");
const auth = require("../middleware/auth");
const Package = require("../models/TourPackages");
const upload = require("../config/filesupload");
const router = express.Router();

router.post(
  "/package",
  auth,
  upload.fields([
    { name: "image", maxCount: 5 }, // Allow multiple images (adjust maxCount as needed)
  ]),
  async (req, res) => {
    try {
      const { name, description, price, includedServices, availableDates } =
        req.body;

      console.log(req.files);

      const image = req.files ? req.files.image.map((file) => file.path) : []; // Handling multiple image files

      // console.log(image);

      // Check if all required fields are provided
      if (!name || !description || !price) {
        return res
          .status(400)
          .json({ message: "Please fill out all required fields" });
      }

      // Create a new product with the supplier ID from the authenticated user
      const newProduct = new Package({
        name,
        description,
        price,
        image,
        includedServices: JSON.parse(includedServices),
        availableDates: JSON.parse(availableDates),
        supplier: req.user.userId, // Supplier is the authenticated user
      });

      // Save the new product to the database
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/packages", auth, async (req, res) => {
  try {
    console.log("get packages", req.user.userId);

    const products = await Package.find({ supplier: req.user.userId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/packages/user", auth, async (req, res) => {
  try {
    console.log("get packages", req.user.userId);

    const products = await Package.find().populate("supplier");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/packages/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const product = await Package.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product details" });
  }
});

router.delete("/package/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Package.findByIdAndDelete(id);
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
