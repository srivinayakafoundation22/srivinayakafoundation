// /api/create-order.js

// Import the Razorpay library
const Razorpay = require('razorpay');

// Export the serverless function
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Initialize Razorpay with keys from environment variables
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Get the amount from the request body
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Razorpay requires the amount in the smallest currency unit (paise for INR)
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    // Create an order
    const order = await razorpay.orders.create(options);

    // Send the order details back to the client
    res.status(200).json(order);

  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ error: 'Something went wrong with payment processing' });
  }
};