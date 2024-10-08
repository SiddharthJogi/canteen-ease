const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/canteen-ease', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error(err);
});

// Schema for Orders
const orderSchema = new mongoose.Schema({
    studentId: String,
    meal: String,
    notes: String,
    status: { type: String, default: 'Pending' }
});

const Order = mongoose.model('Order', orderSchema);

// Place an order
app.post('/api/order', async (req, res) => {
    const { studentId, meal, notes } = req.body;
    const newOrder = new Order({ studentId, meal, notes });
    await newOrder.save();
    res.json({ message: 'Order placed successfully!', orderId: newOrder._id });
});

// Check order status
app.get('/api/status/:orderId', async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if (order) {
        res.json({ status: order.status });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

// Admin route to update status
app.post('/api/update-status', async (req, res) => {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);
    if (order) {
        order.status = status;
        await order.save();
        res.json({ message: 'Order status updated successfully' });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
