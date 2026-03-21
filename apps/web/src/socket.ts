import { io } from 'socket.io-client'

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD
    ? window.location.origin
    : 'http://localhost:4000')

const socket = io(SOCKET_URL, {
  autoConnect: false,
})

export default socket
