const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/error.js");

const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          name: name,
          email: email,
        },
        process.env.JWTSECRET
      );

      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
        })
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(35).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      const token = jwt.sign(
        {
          id: newUser._id,
          name: name,
          email: email,
        },
        process.env.JWTSECRET
      );

      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          path: "/",
        })
        .json(rest);
    }
  } catch (error) {
    next(errorHandler(error.statusCode || 500, error.message || "Internal Server Error"));
  }
};

const Logout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(errorHandler(error.statusCode || 500, error.message || "Internal Server Error"));
  }
};

module.exports = { google, Logout };
