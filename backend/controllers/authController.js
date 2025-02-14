const User = require("../models/user");
const Admin = require("../models/admin");
const nodemailer = require("nodemailer");
// const mailer = require("../utils/mailer");
const Otp = require("../models/otp");
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

      const createdUser = await user.save();

      const otpCode = Math.floor(100000 + Math.random() * 900000);
    let otp = new Otp({
        userId: createdUser.user_id,
        email: createdUser.email,
        otp: otpCode,
    });
    otp = await otp.save();

      const auth = nodemailer.createTransport({
              service: "gmail",
              secure: true,
              port: 465,
              auth: {
                  user: process.env.MAILER_MAIL,
                  pass: process.env.MAILER_SECRET,
              },  
          })

          const reciever = {
            from: process.env.MAILER_MAIL,
            to: createdUser.email,
            subject: "Test",
            text: `Hello ${createdUser.name}, Welcome to our website otp is ${otpCode}`,
        }

        auth.sendMail(reciever, (error, info) => {
          if(error) {
              console.log(error);
          } else {
              console.log("Email sent: " + info.response);
          }
      });

      const token = jwt.sign(
        {
          _id: user._id,
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
              _id: user._id,
              user_id: user.user_id,
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
          console.log(user)

          res.status(200).json({ message: "Login successful", user });
        }
      }
    } catch (error) {
      res.status(404).send("Internal Server Error");
    }
  },

  

  verifyOtp: async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const otpData = await Otp.findOne({ userId: userId });
        console.log(otpData);

        if (!otpData) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // Convert OTPs to the same type for comparison
        if (parseInt(otpData.otp) === parseInt(otp)) {
            user.isVerified = true;
            await user.save({ validateBeforeSave: false });

            // Remove OTP after successful verification (optional)
            // await Otp.deleteOne({ userId: userId });

            return res.status(200).json({ success: true, message: "OTP verified" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

    } catch (error) {
        console.error("Verify OTP error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

};

module.exports = authController;