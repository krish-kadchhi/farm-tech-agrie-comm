const User = require("../models/user");
const jwt = require("jsonwebtoken");

const cartController = {
  addToCart: async (req, res) => {
    try {
      const token = req.cookies.loginCookie;
      if (!token) {
        return res.status(401).send("No token provided");
      }

      const decoded = jwt.verify(token, "mysecret2");
      const userEmail = decoded.email;

      const cartItem = {
        item: req.body.item,
        category: req.body.category,
        price: req.body.price,
        image: req.body.image,
        quantity: req.body.quantity || 1
      };

      const updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        {
          $push: { cart: cartItem }
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).send("Item added successfully");
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).send("Error adding item to cart");
    }
  },

  showCart: async (req, res) => {
    try {
      const token = req.cookies.loginCookie;
      if (!token) {
        return res.status(401).send("No token provided");
      }

      const decoded = jwt.verify(token, "mysecret2");
      const userEmail = decoded.email;

      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).send("User not found");
      }

      res.send(user.cart || []);
    } catch (error) {
      console.error("Show cart error:", error);
      res.status(500).send("Error retrieving cart");
    }
  },

  deleteFromCart: async (req, res) => {
    try {
      const { item } = req.body;
      const token = req.cookies.loginCookie;
      
      if (!token) {
        return res.status(401).send("No token provided");
      }

      const decoded = jwt.verify(token, "mysecret2");
      const email = decoded.email;

      // Use $pull operator to remove the item from the cart array
      const result = await User.findOneAndUpdate(
        { email: email },
        { 
          $pull: { 
            cart: { item: item } 
          } 
        },
        { new: true }
      );

      if (!result) {
        return res.status(404).send("User not found or item not in cart");
      }

      res.status(200).send("Item removed successfully");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).send("Error removing item from cart");
    }
  },
};

module.exports = cartController;