import http from "http";
import { env } from "./config/env";
import { createApp } from "./app";
import { createSocketServer } from "./sockets";
import { startOrderScheduler } from "./services/order-scheduler";

const app = createApp();
const httpServer = http.createServer(app);

createSocketServer(httpServer);

httpServer.listen(env.PORT, () => {
  console.log(`[server] Running on http://localhost:${env.PORT}`);
  console.log(`[server] Swagger docs at http://localhost:${env.PORT}/api-docs`);
  console.log(`[server] Environment: ${env.NODE_ENV}`);

  startOrderScheduler();
});
