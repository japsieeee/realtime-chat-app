const SocketModel = require("../models/Socket");
const MessageModel = require("../models/Message");
const { reverseChannelID } = require("../utils/helpers");

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
      this.socket.join(reverseID);
      this.room = reverseID;
    } else {
      try {
        if (!currentRoom) {
          await SocketModel.create({ _id: channelID });
        }

        this.socket.join(channelID);
        this.room = channelID;
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
}

module.exports = SocketConnection;
