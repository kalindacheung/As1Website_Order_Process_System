const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Support JSON data
app.use(express.static(__dirname + '/public'));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error:', err));


const Order = require('./models/order');
const orderRoutes = require('./routes/orderRoutes'); // Import the order routes
app.use('/orders', orderRoutes);//connect the routes

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

app.get('/', (req, res) => {
  res.render('index');
});
// Endpoint to list all orders
app.get('/all-orders', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('driver');
      res.render('orders', { orders });
  } catch (err) {
      res.status(500).send(err);
  }
});

// Endpoint to list completed orders
app.get('/completed-orders', async (req, res) => {
  try {
      const completedOrders = await Order.find({ status: 'DELIVERED' }).populate('driver');;
      res.render('completedOrders', { completedOrders });
  } catch (err) {
      res.status(500).send(err);
  }
});


// Endpoint when the user search a customer
app.post('/search-orders', async (req, res) => {
  const { customerName } = req.body; // Expecting customerName from the form
  try {
      const orders = await Order.find({}).populate('driver').populate('photo');;
      // Normalize the customerName to lower case
      const lowerCaseCustomerName = customerName.toLowerCase();
      // Filter orders based on normalized customer name
      const filteredOrders = orders.filter(order => 
          order.customerName.toLowerCase() === lowerCaseCustomerName
      );
      res.render('orders', { orders: filteredOrders }); // Render the orders view with search results
  } catch (err) {
      res.status(500).send(err);
  }
});

// Search for completed orders by customer name
app.post('/search-completed-orders', async (req, res) => {
  const { customerName } = req.body; // Expecting customerName from the form
  try {
      // Fetch all completed orders where status is 'DELIVERED'
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

