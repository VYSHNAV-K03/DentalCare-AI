const express = require('express');
const Enrollment = require('../models/enrollmentModel'); // Enrollment model
const authMiddleware = require('../middleware/auth');
const bookingpackage = require('../models/bookingpackage');
const auth = require('../middleware/auth');


const router = express.Router();

router.post('/verify-payment',authMiddleware, async (req, res) => {

    try {
      // Step 1: Save enrollment details in the database
      const newEnrollment = new Enrollment({
        userId: req.user.userId, // Authenticated user ID
        guideid: req.body.guideid,
        amountPaid: req.body.amount,
        status: 'Paid',
        createdAt: new Date(),
      });
  
      await newEnrollment.save();
  
      console.log("Payment verified and enrollment saved:", newEnrollment);

      res.status(200).json({ success: true, message: 'Payment verified and Guide Booked Successfully' });
    } catch (error) {
      console.error("Error during enrollment:", error);
      res.status(500).json({ success: false, message: 'Enrollment saving failed.', error });
    }
  });


  router.post('/verify-payment/package',auth, async (req, res) => {

    try {
      // Step 1: Save enrollment details in the database
      const newEnrollment = new bookingpackage({
        userId: req.user.userId, // Authenticated user ID
        itemId: req.body.itemId,
        amountPaid: req.body.amount,
        status: 'Paid',
        createdAt: new Date(),
      });
  
      await newEnrollment.save();
  
      console.log("Payment verified and enrollment saved:", newEnrollment);

      res.status(200).json({ success: true, message: 'Payment verified and Guide Booked Successfully' });
    } catch (error) {
      console.error("Error during enrollment:", error);
      res.status(500).json({ success: false, message: 'Enrollment saving failed.', error });
    }
  });



  module.exports = router;
  