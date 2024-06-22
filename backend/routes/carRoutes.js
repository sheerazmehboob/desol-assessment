const express = require('express');
const router = express.Router();
const { submitCar } = require('../controllers/carController');
const { authMiddleware } = require('../controllers/authController');

router.post('/', authMiddleware, submitCar);

module.exports = router;
