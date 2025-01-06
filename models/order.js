const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerPhoneNumber: { type: String, required: true },
    customerEmail: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'READY FOR DELIVERY', enum: ['READY FOR DELIVERY', 'IN TRANSIT', 'DELIVERED'] },
    photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Image'  },
    orderDate: { type: Date, default: Date.now },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' } // Reference to Driver
});

module.exports = mongoose.model('Order', orderSchema);
