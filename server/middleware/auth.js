const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token');


    // console.log("auth middleware",token);

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("user", decoded);
        

        // Attach user info to the request object
        const user = await User.findById(decoded.user.id); // Assuming decoded contains userId

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        req.user = { userId: user._id, name: user.name, role: user.role }; // Pass user ID and name
        
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
