const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    plate: { type: String, required: true }, 
});

module.exports = mongoose.model('Driver', driverSchema);