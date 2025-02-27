const Item = require("../models/item");
const multer = require("multer");
const uploadOnCloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");

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
        name: { $regex: query, $options: "i" },
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
     // Get token from cookies
     const token = req.cookies.loginCookie;
     if (!token) {
       return res
         .status(401)
         .json({ message: "Unauthorized - No token found" });
     }

     // Verify token
     const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecret2");
     console.log("Decoded Token:", decoded);

     // Get user's city from decoded token
     const city = decoded.address;
     console.log(city);
     
     if (!city) {
       return res.status(400).json({ message: "User city not found in token" });
     }

     // Fetch products for user's city
     const items = await Item.find({
       city: { $in: Array.isArray(city) ? city : [city] },
     });
     console.log(items);
     
     console.log("Products fetched:", items.length);

     res.send(items);
   } catch (error) {
     console.error("Error fetching products:", error);
     res.status(500).json({ message: "Error fetching products" });
   }
  },

  // addProduct: async (req, res) => {
  //   try {
  //     const data = {
  //       name: req.body.product_name,
  //       category: req.body.product_category,
  //       price: req.body.product_price,
  //       image: req.file.path,
  //     };
  //     await Item.insertMany(data);
  //     res.status(201).json({
  //       message: "Added successfully.",
  //       imagePath: data.image,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       message: "Error uploading file",
  //       error: error.message,
  //     });
  //   }
  // },

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

      if (!imagelocalpath) {
        return res.status(400).json({
          message: "Image is required",
        });
      }

      const image = await uploadOnCloudinary(imagelocalpath);

      if (!image) {
        return res.status(400).json({
          message: "error uploading image on cloudinary",
        });
      }
      const item = await Item.create({
        ...data,
        image: image.url,
      });

      if (!item) {
        return res.status(400).json({
          message: "Error adding product",
        });
      }

      return res.status(201).json({
        message: "Product added successfully",
        item,
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
