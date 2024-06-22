const multer = require('multer');
const path = require('path');
const Car = require('../models/Car');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Function to handle car submission with multer
const submitCar = (req, res) => {
    upload.array('images', 10)(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(500).json({ msg: 'Server error' });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).json({ msg: 'Server error' });
        }

        // Process form fields and uploaded files
        const { model, price, phone, city } = req.body;
        const images = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);

        try {
            const newCar = new Car({
                model,
                price,
                phone,
                city,
                images,
            });

            await newCar.save();

            res.status(200).json({ msg: 'Car submitted successfully' });
        } catch (error) {
            console.error('Car submission error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    });
};


module.exports = { submitCar };
