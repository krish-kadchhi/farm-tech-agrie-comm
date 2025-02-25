const Item = require("../models/item");
const multer = require("multer");
const uploadOnCloudinary = require("../utils/cloudinary");
const { cookie } = require("express/lib/response");
const jwt= require("jsonwebtoken");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const itemController = {
  searchItems: async (req, res) => {
    try {
      let query = req.query.query;
      const items = await Item.find({
        name: { $regex: query, $options: 'i' }
      });
      res.status(200).send(items);
    } catch (error) {
      console.error("Error searching items:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  getAllItems: async (req, res) => {
    try {
      const items = await Item.find();
      
      // res.render("item.ejs", { items });
      
    } catch (error) {
      res.status(500).send({ message: "Error fetching items" });
    }
  },

  showPro: async (req, res) => {
    try {
      const loginCookie = req.cookies.loginCookie;
      if (!loginCookie) {
        return res.status(401).json({ message: "No authentication token found" });
      }

      // Decode the JWT token
      const decoded = jwt.verify(loginCookie, "mysecret2");
      if (!decoded.address) {
        return res.status(400).json({ message: "User address not found in token" });
      }

      // Get user's city from the address
      const userCity = decoded.address.split(',').pop().trim();

      // Find items where the user's city matches any city in the item's city array (case insensitive)
      const items = await Item.find({
        city: { 
          $regex: new RegExp('^' + userCity + '$', 'i') 
        }
      });

      if (items.length === 0) {
        return res.status(200).json({ 
          message: "No items found in your city", 
          userCity: userCity 
        });
      }

      res.status(200).json({
        message: "Items found successfully",
        userCity: userCity,
        items: items
      });

    } catch (error) {
      console.error("Error in showPro:", error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Invalid token" });
      }
      res.status(500).json({ message: "Error fetching products", error: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      await Item.deleteOne({ id: id });
      res.status(200).send("Successfully deleted");
    } catch (error) {
      res.status(500).send("Error deleting product");
    }
  },

  //controller
 searchItems: async (req, res) => {
  try {
    let query = req.query.query;
    const items = await Item.find({
      name: { $regex: query, $options: "i" },
    });
    res.status(200).send(items);
  } catch (error) {
    console.error("Error searching items:", error);
    res.status(500).send({ message: "Internal server error" });
  }
},

addProduct: async (req, res) => {
  try {
    const data = {
      name: req.body.productName,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      city: req.body.cityArray,
    };
    // res.status(201).json({
      //   message: "Added successfully.",
      //   imagePath: data.image,
      // });
      
      const imagelocalpath = req.files?.image[0].path;
      
      if(!imagelocalpath) {
        return res.status(400).json({
          message: "Image is required"
        });
      } 
      
      const image = await uploadOnCloudinary(imagelocalpath);

      if(!image) {
        return res.status(400).json({
          message: "error uploading image on cloudinary"
        });
      }
      const item = await Item.create({
        ...data,
        image: image.url,
      })

      if(!item) {
        return res.status(400).json({
          message: "Error adding product"
        });
      }

      return res.status(201).json({
        message: "Product added successfully",
        item
      });

  } catch (error) {
    res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
},
};



module.exports = itemController;