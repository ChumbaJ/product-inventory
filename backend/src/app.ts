import "reflect-metadata";
import http from "http";
import router from "./router/router";
import { initDB } from "./data-source";
import { config } from "./config";
import { logger } from "./core/logger";

async function bootstrap() {
  await initDB();

  const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    logger(req, res);

    router(req, res);
  });

  server.listen(config.port, () => {
    console.log(`server is running: http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal error on bootstrap", err);
  process.exit(1);
});
