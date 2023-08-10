require("dotenv").config();
const { default: mongoose } = require("mongoose");
const express = require("express");
const cors = require("cors");
const SocketConnection = require("./classes/SocketConnection");

const app = express();

const server = app.listen(3000, async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
});

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.SOCKET_IO_ORIGIN,
  },
});

const rootRoute = require("./routes/root.r");
const userRoute = require("./routes/user.r");
const messageRoute = require("./routes/message.r");

const { updateOnline, updateOffline, findOnline } = require("./utils/helpers");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rootRoute);
app.use("/message", messageRoute);
app.use("/user", userRoute);

// socket io
io.on("connection", async (socket) => {
  // instance
  const socket_instance = new SocketConnection(io, socket);

  // join and send message
  socket.on("join-room", async (roomID) => socket_instance.joinRoom(roomID));
  socket.on("send-message", async (payload) =>
    socket_instance.sendMessage(payload)
  );
  socket.on("typing-message", async (payload) =>
    socket_instance.typingMessage(payload)
  );

  // user activity sockets
  socket.on("active-user", async (payload) =>
    socket_instance.updateOnline(payload)
  );
  socket.on("offline", async () => socket_instance.updateOffline());
  socket.on("disconnect", async () => socket_instance.updateOffline());
  socket.on("is-typing", async (payload) => socket_instance.isTyping(payload));
});
