import { Server, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';

let io: Server;

interface JwtPayload {
  sub: string;
}

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error('Unauthorized'));
      }

      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JwtPayload;

      socket.data.userId = payload.sub;

      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
