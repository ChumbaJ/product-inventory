import { IncomingMessage, ServerResponse } from "http";
export function logger(req: IncomingMessage, res: ServerResponse) {
  const start = Date.now();

  const { method, url } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${method} ${url} - ${res.statusCode} (${duration}ms)`);
  });
}
