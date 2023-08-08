const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    message: {
      type: String,
      require: true,
    },
    from: {
      type: String,
      require: true,
    },
    to: {
      type: String,
      require: true,
    },
    channelID: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const messageModel = model("message", messageSchema);

module.exports = messageModel;
