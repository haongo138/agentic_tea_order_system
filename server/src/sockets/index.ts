import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function createSocketServer(httpServer: HttpServer): SocketIOServer {
  const socketServer = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  socketServer.on("connection", (socket) => {
    console.log(`[socket] Client connected: ${socket.id}`);

    socket.on("join-branch", (branchId: number) => {
      const room = `branch:${branchId}`;
      socket.join(room);
      console.log(`[socket] ${socket.id} joined room ${room}`);
    });

    socket.on("join-customer", (customerId: number) => {
      const room = `customer:${customerId}`;
      socket.join(room);
      console.log(`[socket] ${socket.id} joined room ${room}`);
    });

    socket.on("join-admin", () => {
      socket.join("admin");
      console.log(`[socket] ${socket.id} joined room admin`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`[socket] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  io = socketServer;
  console.log("[socket] Socket.io server initialized");

  return socketServer;
}

export function getIO(): SocketIOServer | null {
  return io;
}
