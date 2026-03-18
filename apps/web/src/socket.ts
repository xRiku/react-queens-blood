import { io } from "socket.io-client";

const socket = io(`${window.location.hostname}:4000`, {
  autoConnect: false,
});

export default socket;
