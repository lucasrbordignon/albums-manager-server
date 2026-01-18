import { app } from './app';
import { env } from './config/env';
import http from 'http';
import { initSocket } from './ws/socket';
import { startRedisListener } from './ws/redis-listener';

const server = http.createServer(app)

initSocket(server)

startRedisListener();

server.listen(env.PORT, "0.0.0.0",() => {
  console.log(`🚀 HTTP Server running on port ${env.PORT}`);
});
