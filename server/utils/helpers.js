const UserModel = require("../models/User");

module.exports.updateOnline = async (_id, socketID) => {
  await UserModel.findByIdAndUpdate(
    { _id },
    {
      active: "online",
      socketID,
    }
  );
};

module.exports.updateOffline = async (socketID) => {
  await UserModel.findOneAndUpdate(
    { socketID },
    {
      active: "offline",
      socketID: "",
    }
  );
};

module.exports.findOnline = async () => {
  const onlineUsers = await UserModel.find({ active: "online" });
  return onlineUsers.length <= 0 ? [] : onlineUsers.map((user) => user._id);
};

module.exports.reverseChannelID = async (channelID) => {
  return `${channelID.split("-")[1]}-${channelID.split("-")[0]}`;
};
