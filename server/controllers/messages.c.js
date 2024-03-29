const Message = require("../models/Message");

const { reverseChannelID } = require("../utils/helpers");

module.exports.getMessage = async (req, res) => {};

module.exports.browseMessage = async (req, res) => {
  const { channelID } = req.params;

  const reverseID = reverseChannelID(channelID);

  // checks both ids
  const find = await Message.find({ channelID });
  const find2 = await Message.find({ channelID: reverseID });

  if (find.length >= 1) {
    return res.status(200).json({
      data: find,
      message: "message fetch success",
      error: null,
    });
  } else if (find2.length >= 1) {
    return res.status(200).json({
      data: find2,
      message: "message fetch success",
      error: null,
    });
  } else {
    return res.status(404).json({
      data: null,
      message: "message fetch failed",
      error: "Message could not be found",
    });
  }
};
