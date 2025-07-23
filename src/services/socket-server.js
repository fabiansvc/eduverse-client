import socketIOClient from "socket.io-client";

/**
 * Socket connection
 */
export const socketServer = socketIOClient(
  import.meta.env.VITE_SERVER_DEPLOY_URL
);
