const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const Item = require("../models/item");
const Order = require("../models/order");
const dotenv = require("dotenv");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const paymentController = {
  checkout: async (req, res) => {
    try {
      const { amount, cartItems, quantity, userId } = req.body;
      console.log("cartItems", cartItems);

      // Fetch all valid items from the item database
      const validItems = await Item.find({}, "name stock");
      const validItemNames = new Set(validItems.map((item) => item.name));

      // Filter out invalid items from the cart
      const validCartItems = cartItems.filter((cartItem) =>
        validItemNames.has(cartItem.item)
      );

      console.log("Valid Cart Items:", validCartItems);

      // Check if valid cart is empty
     if (validCartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot proceed with payment: Cart is empty or contains invalid items",
        });
      } 

      // Update stock for valid items (only if cart is valid)
      for (let i = 0; i < validCartItems.length; i++) {
        const product = await Item.findOne({ name: validCartItems[i].item });
        if (product) {
          product.stock -= validCartItems[i].quantity;

          // If stock reaches 0, delete the item from the Item schema
          if (product.stock <= 0) {
            await Item.deleteOne({ name: product.name });

            // Remove the item from the user's cart
            // await User.updateOne(
            //   { _id: userId },
            //   { $pull: { cart: { item: product.name } } }
            // );

            console.log(`Deleted ${product.name} from items and user's cart`);
          } else {
            await product.save();
            console.log(`Updated stock for ${product.name}:`, product.stock);
          }
        }
      }

      // Create a Razorpay order
      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);

      res.json({
        success: true,
        orderId: order.id,
        amount: amount,
        cartItems: validCartItems,
        payStatus: "created",
        quantity,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({
        success: false,
        message: "Error during checkout",
      });
    }
  },

  verify: async (req, res) => {
    try {
      const {
        orderId,
        paymentId,
        signature,
        amount,
        quantity,
        cartItems,
        userId,
      } = req.body;

      // Create payment record
      const orderConfirm = new Payment({
        orderId,
        paymentId,
        signature,
        amount,
        quantity,
        cartItems,
        userId,
        payStatus: "paid",
      });
      await orderConfirm.save();

      // Get user details for shipping address
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Create order record
      const newOrder = new Order({
        userId,
        items: cartItems,
        totalAmount: amount,
        paymentId,
        orderId,
        shippingAddress: user.address,
      });
      await newOrder.save();

      // Clear user's cart after successful order
      await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

      res.json({ 
        message: "Payment and order created successfully!", 
        success: true, 
        orderConfirm,
        order: newOrder 
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).send("Error verifying payment");
    }
  },
};

module.exports = paymentController;
