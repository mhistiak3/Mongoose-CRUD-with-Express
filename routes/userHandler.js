// dependencies
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// application router
const router = express.Router();
// application module
const userSchema = require("../schemas/userSchema");

// User Class
const User = new mongoose.model("User", userSchema);

// routes
router.post("/singup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).json({ message: "singup was successful" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Singup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "5h",
          }
        );
        res
          .status(200)
          .json({ access_token: token, message: "Login Successful" });
      } else {
        res.status(401).json({ error: "Authentication failed" });
      }
    } else {
      res.status(401).json({ error: "Authentication failed" });
    }
    
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "login failed" });
  }
});

module.exports = router;
