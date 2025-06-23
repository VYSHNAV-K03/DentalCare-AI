const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'guide', 'admin','packagemanger'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    location: { type: String },
    ratePerHour: { type: Number },
    availability: { type: Boolean, default: false },
    profileImage: { type: String }, // Path to uploaded profile image
    certificate: { type: String }, // Path to uploaded certificate
    date: { type: Date, default: Date.now },
    schedule: [
        {
          date: String,
          time: String,
        },
      ],
});

module.exports = mongoose.model('User', userSchema);

