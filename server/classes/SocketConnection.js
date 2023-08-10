const SocketModel = require("../models/Socket");
const MessageModel = require("../models/Message");
const UserModel = require("../models/User");

const {
  reverseChannelID,
  updateOnline,
  updateOffline,
  findOnline,
} = require("../utils/helpers");

class SocketConnection {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    this.room = "";
  }

  async joinRoom(channelID) {
    const reverseID = reverseChannelID(channelID);

    const currentRoom = await SocketModel.findById(channelID);
    const existingRoom = await SocketModel.findById(reverseID);

    if (existingRoom) {
      this.room = reverseID;
      this.socket.join(reverseID);
    } else {
      try {
        if (!currentRoom) {
          await SocketModel.create({ _id: channelID });
        }

        this.room = channelID;
        this.socket.join(channelID);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async sendMessage({ message, from, to, createdAt }) {
    const payload = {
      message,
      channelID: this.room,
      from,
      to,
      createdAt,
    };

    this.io.to(this.room).emit("receive-message", payload);

    const user = await UserModel.findById(from);

    const filteredData = {
      _id: user._id,
      email: user.email,
    };

    this.io.emit("receive-notification", { ...payload, from: filteredData });

    try {
      await MessageModel.create(payload);
    } catch (error) {
      console.log(error);
    }
  }

  async typingMessage(payload) {
    const { channelID } = payload;

    const reverseID = reverseChannelID(this.room);
    const currentRoom = await SocketModel.findById(this.room);
    const existingRoom = await SocketModel.findById(reverseID);

    if (currentRoom) {
      this.io.to(channelID).emit("receive-typing-message", payload);
    }

    if (existingRoom) {
      this.io.to(reverseID).emit("receive-typing-message", payload);
    }
  }

  async updateOnline(payload) {
    const { _id } = payload;

    await updateOnline(_id, this.socket.id);
    const active_users = await findOnline();

    this.io.emit("get-active-users", active_users);
  }

  async updateOffline() {
    await updateOffline(this.socket.id);

    const active_users = await findOnline();
    this.io.emit("get-active-users", active_users);
  }

  async isTyping(payload) {
    const overridePayload = { ...payload, channelID: this.room };

    this.io.to(this.room).emit("receive-is-typing", overridePayload);
  }
}

module.exports = SocketConnection;
