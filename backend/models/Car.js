const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    model: { type: String, required: true, minlength: 3 },
    price: { type: Number, required: true },
    phone: { type: String, required: true, minlength: 11, maxlength: 11 },
    city: { type: String, required: true },
    images: { type: [String], required: true },
});

module.exports = mongoose.model('Car', CarSchema);
