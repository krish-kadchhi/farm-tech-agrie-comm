const Item = require("../models/item");
const multer = require("multer");

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

  showProducts: async (req, res) => {
    try {
      const items = await Item.find();
      console.log("a ready");
      
      res.send(items);
    } catch (error) {
      res.status(500).send({ message: "Error fetching products" });
    }
  },

  addProduct: async (req, res) => {
    try {
      const data = {
        name: req.body.product_name,
        category: req.body.product_category,
        price: req.body.product_price,
        image: req.file.path,
      };
      await Item.insertMany(data);
      res.status(201).json({
        message: "Added successfully.",
        imagePath: data.image,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error uploading file",
        error: error.message,
      });
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
  }
};

module.exports = itemController;