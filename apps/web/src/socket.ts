import { io } from 'socket.io-client'

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD
    ? window.location.origin
    : 'http://localhost:4000')

const socket = io(SOCKET_URL, {
  autoConnect: false,
  timeout: 90_000,
})

export function connectSocket(): Promise<void> {
  if (socket.connected) return Promise.resolve()

  return new Promise((resolve, reject) => {
    socket.connect()

    const onConnect = () => {
      cleanup()
      resolve()
    }

    const onError = (err: Error) => {
      cleanup()
      socket.disconnect()
      reject(err)
    }

    function cleanup() {
      socket.off('connect', onConnect)
      socket.off('connect_error', onError)
    }

    socket.once('connect', onConnect)
    socket.once('connect_error', onError)
  })
}

export default socket
