const express = require('express');
const mongoose = require('mongoose');
// Import the Driver model
const Order = require('../models/order');
const Image = require('../models/image');
const Driver = require('../models/driver'); 
const router = express.Router();

// List of all current orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({}).populate('driver').populate('image');; // Populate driver info and image
        res.render('orders', { orders });
    } catch (err) {
        res.status(500).send(err);
    }
});

// List of completed orders
router.get('/completed', async (req, res) => {
    try {
        const completedOrders = await Order.find({ status: 'DELIVERED' }).populate('driver').populate('image'); // Populate driver info and image
        res.render('completedOrders', { completedOrders });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Search all orders by customer name
router.post('/search', async (req, res) => {
    const { customerId } = req.body;
    try {
        const orders = await Order.find({ _id: mongoose.Types.ObjectId(customerId) }).populate('driver').populate('image'); // Populate driver info 
        res.render('orders', { orders });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Search completed orders by customer name
router.post('/search-completed-orders', async (req, res) => {
    const { customerName } = req.body; // Expecting customerName from the form
    try {
        // Fetch all completed orders (DELIVERED status)
        const completedOrders = await Order.find({ status: 'DELIVERED' })
            .populate('driver') // Populate driver information
            .populate('photo');  // Populate image information

        // Normalize the customerName to lower case for case-insensitive search
        const lowerCaseCustomerName = customerName.toLowerCase();

        // Filter completed orders by customer name
        const filteredOrders = completedOrders.filter(order =>
            order.customerName.toLowerCase() === lowerCaseCustomerName
        );

        // Render 'completedOrders' view with filtered results
        res.render('completedOrders', { completedOrders: filteredOrders });
    } catch (err) {
        res.status(500).send(err);
    }
});
module.exports = router;
//Get the delivery image from database
router.get('/image/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (image) {
            res.set('Content-Type', image.img.contentType); // Set the appropriate content type
            res.send(image.img.data); // Send the binary data
        } else {
            res.status(404).send('Image not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

