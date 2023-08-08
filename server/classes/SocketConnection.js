const SocketModel = require("../models/Socket");
const MessageModel = require("../models/Message");

class SocketConnection {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  async joinRoom(roomID) {
    const reverseID = `${roomID.split("-")[1]}-${roomID.split("-")[0]}`;
    const currentRoom = await SocketModel.findById(roomID);
    const existingRoom = await SocketModel.findById(reverseID);

    if (existingRoom) {
      this.socket.join(reverseID);
    } else {
      try {
        if (!currentRoom) {
          await SocketModel.create({ _id: roomID });
        }

        this.socket.join(roomID);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async sendMessage({ message, channelID, from, to }) {
    const reverseID = `${channelID.split("-")[1]}-${channelID.split("-")[0]}`;
    const currentRoom = await SocketModel.findById(channelID);
    const existingRoom = await SocketModel.findById(reverseID);

    if (currentRoom) {
      const payload = {
        message,
        channelID,
        from,
        to,
      };

      this.io.to(channelID).emit("receive-message", payload);

      try {
        await MessageModel.create(payload);
      } catch (error) {
        console.log(error);
      }
    }

    if (existingRoom) {
      const payload = {
        message,
        channelID: reverseID,
        from,
        to,
      };

      this.io.to(reverseID).emit("receive-message", payload);

      try {
        await MessageModel.create(payload);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

module.exports = SocketConnection;
