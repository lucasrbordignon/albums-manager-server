import { app } from './app';
import { env } from './config/env';
import http from 'http';

const server = http.createServer(app)

server.listen(env.PORT, "0.0.0.0",() => {
  console.log(`🚀 HTTP Server running on port ${env.PORT}`);
});
