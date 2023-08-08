const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");

module.exports.logout = async (req, res, next) => {
  res.clearCookie("access-token");
  res.clearCookie("refresh-token");

  return res.json({ message: "log out" });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user === null) return res.json({ message: "user not found", user: null });

  const passwordsMatch = bcrypt.compareSync(password, user.password);

  if (!passwordsMatch)
    return res.status(401).json({
      message: "incorrect email or password",
      error: "Incorrect Email/Password",
      user: null,
    });

  const payload = { _id: user._id, email };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  const cookieOpts = { httpOnly: true };

  res.cookie("access-token", accessToken, cookieOpts);
  res.cookie("refresh-token", refreshToken, cookieOpts);

  return res.json({
    message: "Login Success",
    user: { _id: user._id, email },
    error: null,
  });
};

module.exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.json({
        message: "user exist",
        error: "User Already Exist",
        user: null,
      });

    const { _id } = await User.create({
      email,
      password: hash,
    });

    return await res.json({
      message: "sign up success",
      error: null,
      user: { _id, email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error, message: "Internal Server Error", user: null });
  }
};

module.exports.browseUser = async (req, res, next) => {
  const users = await User.find();
  const filter = users.map((user) => {
    return {
      _id: user._id,
      email: user.email,
    };
  });

  return res.json({
    data: filter,
    message: "fetch users successfully",
    error: null,
  });
};

module.exports.getUser = async (req, res, next) => {
  return res.json({ data: { info: req.info }, error: null });
};
