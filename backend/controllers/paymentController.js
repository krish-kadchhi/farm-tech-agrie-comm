const Razorpay = require('razorpay');
const Payment = require('../models/payment');
const User = require('../models/user');
const date = require('date-and-time');
const dotenv = require('dotenv');

dotenv.config();

const razorpay = new Razorpay({ 
    key_id: process.env.KEY_ID, 
    key_secret: process.env.KEY_SECRET 
})
const paymentController = {

    checkout: async (req, res) => {
       const { amount, cartItems, userShipping,  quantity } = req.body;
    //    const userId = req.user._id;

    //    const user = await User.findById(userId);
    //    userAddress = user.address;
    //    console.log("User Address:", userAddress);
   
       var options = {
           amount: amount*100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
           currency: "INR",
           receipt: `receipt_${Date.now()}`
         };
         const order = await razorpay.orders.create(options);
   
         res.json({
           orderId: order.id,
           amount: amount,
           cartItems,
        //    userId,
           payStatus: "created",
            quantity,
            // userAddress
         })
   },
   
   verify: async (req, res) => {
       const { orderId, paymentId, signature, amount, quantity, cartItems, userId } = req.body;

       let orderConfirm = new Payment({
           orderId,
           paymentId,
           signature,
           amount,
           quantity,
           cartItems,
           userId,
           payStatus: "paid",
       })

        orderConfirm.save()
        .then(() => {
            res.json({message: "Payment success!", success: true, orderConfirm})
        })
   }
}


module.exports = paymentController;