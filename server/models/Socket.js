const { Schema, model } = require("mongoose");

const socketSchema = new Schema(
  {
    _id: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const socketModel = model("socket", socketSchema);

module.exports = socketModel;
