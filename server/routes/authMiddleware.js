const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  console.log("auth middleware token",req.header('x-auth-token'));
  
  const token = req.header('x-auth-token');
  console.log("authMiddleware",token);
  
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  
  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("user", decoded);
    
    
    const user = await User.findById(decoded.id); // Assuming decoded contains userId

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = { userId: user._id, name: user.name, role: user.role }; // Pass user ID and name
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;




