const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

// Make sure these routes match what your frontend is calling
router.post('/generate-ad', (req, res, next) => {
  console.log({hi:"hjghfdsjakjlkkdsjsjahk"});
  next();
}, adController.generateAd);
router.post('/generate', adController.generateAd);

// Add other routes as needed

module.exports = router;
