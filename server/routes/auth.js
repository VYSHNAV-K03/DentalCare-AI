const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
const Chat = require("../models/chatSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/fileUpload");
const authMiddleware = require("../middleware/auth");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user instance
    user = new User({
      name,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Check if the user is a guide and not verified
    if (user.role === "guide" && !user.isVerified) {
      return res
        .status(403)
        .json({ msg: "Doctor not verified. Please contact admin." });
    }

    if (user.role === "packagemanger" && !user.isVerified) {
      return res
        .status(403)
        .json({ msg: "Hospital not verified. Please contact admin." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role, // Include the role in the payload
      },
    };

    // Sign JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/auth/register-guide
// @desc    Register a new guide
// @access  Public
router.post(
  "/register-guide",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, email, password, location, ratePerHour, availability } =
      req.body;

    try {
      // Check if guide exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "Doctor already exists" });
      }

      // Create new guide instance with file paths
      user = new User({
        name,
        email,
        password,
        role: "guide",
        location,
        ratePerHour,
        availability,
        isVerified: false,
        profileImage: req.files["profileImage"][0].path,
        certificate: req.files["certificate"][0].path,
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save guide to database
      await user.save();

      res.json({
        msg: "Doctor registration successful, pending admin verification",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/register-package",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, email, password, location } = req.body;

    try {
      // Check if guide exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "Guide already exists" });
      }

      // Create new guide instance with file paths
      user = new User({
        name,
        email,
        password,
        role: "packagemanger",
        location,
        isVerified: false,
        profileImage: req.files["profileImage"][0].path,
        certificate: req.files["certificate"][0].path,
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save guide to database
      await user.save();

      res.json({
        msg: "Doctor registration successful, pending admin verification",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private Profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update Profile Route
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, location, ratePerHour, availability } = req.body;
    const userId = req.user.userId; // Extracted from JWT token

    // Find and update the user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, location, ratePerHour, availability },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update doctor's schedule
router.put("/update-schedule", authMiddleware, async (req, res) => {
  try {
    const { schedule } = req.body;
    const userId = req.user.userId; // Extracted from JWT token

    // Find doctor by user ID
    const doctor = await User.findById(userId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update schedule
    doctor.schedule = schedule;
    await doctor.save();

    res.json({
      message: "Schedule updated successfully",
      schedule: doctor.schedule,
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/chat/:sender/:reciever", async (req, res) => {
  try {
    const { sender, reciever } = req.params; // Extract influencerId and brandId from URL

    console.log(req.params);

    const chats = await Chat.find({
      $or: [
        { senderId: sender, RecieverId: reciever },
        { senderId: reciever, RecieverId: sender },
      ],
    }).sort({ createdAt: 1 }); // Sort by creation time if needed

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });
  }
});
router.post("/chat/send", upload.single("file"), async (req, res) => {
  try {
    const { RecieverId, senderId, text } = req.body;

    const selectedFile = req.file ? req.file.path : null;

    const message = new Chat({
      senderId,
      RecieverId,
      text,
      fileUrl: selectedFile,
    });
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
});

router.get("/chat/unread/count/:RecieverId", async (req, res) => {
  try {
    const { RecieverId } = req.params;
    const receiverObjectId = new mongoose.Types.ObjectId(RecieverId);

    const unreadMessages = await Chat.aggregate([
      {
        $match: {
          RecieverId: receiverObjectId,
          read: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    const unreadCountMap = {};
    unreadMessages.forEach((msg) => {
      unreadCountMap[msg._id] = msg.count;
    });

    res.json(unreadCountMap);
  } catch (error) {
    res.status(500).json({ error: "Error fetching unread counts" });
  }
});

router.put("/chat/read", async (req, res) => {
  try {
    const { senderId, RecieverId } = req.body;

    console.log(req.body);

    const chats = await Chat.find({
      senderId: RecieverId,
      RecieverId: senderId,
      read: false,
    });

    const updatedMessages = await Chat.updateMany(
      { senderId: RecieverId, RecieverId: senderId, read: false },
      { $set: { read: true } }
    );

    console.log(chats);

    res.json({
      message: "Messages marked as read",
      updatedCount: updatedMessages.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating read status" });
  }
});

// router.put("/chat/read", async (req, res) => {
//   try {
//     const { senderId, RecieverId } = req.body;

//     const updatedMessages = await Chat.updateMany(
//       { senderId, RecieverId, read: false },
//       { $set: { read: true } }
//     );

//     res.json({
//       message: "Messages marked as read",
//       updatedCount: updatedMessages.modifiedCount,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating read status" });
//   }
// });

module.exports = router;
