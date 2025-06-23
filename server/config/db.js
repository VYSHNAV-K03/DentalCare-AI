const mongoose = require('mongoose');
const User = require('../models/User'); // Import User model

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Check if admin user exists
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            // Create admin user
            const adminUser = new User({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: '1234', // In production, hash passwords
                role: 'admin',
            });

            // Hash the admin password
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            adminUser.password = await bcrypt.hash(adminUser.password, salt);

            await adminUser.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
