import { io } from "socket.io-client";

// this connects to the backend endpoint
export const socket = io("http://localhost:3000/", {
  autoConnect: false,
});
