const User = require("../models/user");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

const authController = {
  signup: async (req, res) => {
    try {
      const user = await User.create({
        user_id: uuidv4(),
        name: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        role: req.body.role,
        password: req.body.password,
      });

      const token = jwt.sign(
        {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          password: user.password,
          address: user.address,
        },
        process.env.COOKIE_SECRET,
        { expiresIn: "24h" }
      );

      res.cookie("loginCookie", token, {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(201).json({ message: "Signup successful" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  login: async (req, res) => {
    try {
      const data = {
        name: req.body.username,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
      };
      if (data.role === "Admin") {
        const admin = await Admin.findOne({
          name: data.name,
          password: data.password,
          email: data.email,
        }); // Find admin by email
        let token = jwt.sign(
          {
            name: data.name,
            password: data.password,
            email: data.email,
            role: data.role,
            address: admin.address,
          },
          "mysecret2"
        );
        res.cookie("loginCookie", token, { httpOnly: false });
        console.log(jwt.verify(token, "mysecret2").role);

        res.status(200).send("Login successful");
      } else {
        const user = await User.findOne({
          name: data.name,
          password: data.password,
          email: data.email,
        });
        if (!user) {
          res.status(401).send("Unauthorized");
        } else {
          let token = jwt.sign(
            {
              name: data.name,
              password: data.password,
              email: data.email,
              role: data.role,
              address: user.address,
            },
            "mysecret2"
          );
          res.cookie("loginCookie", token, { httpOnly: false });
          console.log(jwt.verify(token, "mysecret2").role);

          res.status(200).send("Login successful");
        }
      }
    } catch (error) {
      res.status(404).send("Internal Server Error");
    }
  },
};

module.exports = authController;