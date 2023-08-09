const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    active: {
      type: String,
      default: "offline",
    },
    socketID: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = model("user", userSchema);

module.exports = userModel;
