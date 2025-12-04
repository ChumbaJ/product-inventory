import { IncomingMessage, ServerResponse } from "http";
import { Request } from "../core/Request";
import { parseJsonBody, readBody } from "../core/bodyParser";
import { productController } from "../modules/product/product.module";
import { json } from "../core/response";

const routes: Record<string, (req: Request, res: ServerResponse) => void> = {
  "GET /products": productController.get,
  "POST /products": productController.create,
  "PUT /products/:id": productController.update,
  "DELETE /products/:id": productController.delete,
};

export default async function router(
  rawReq: IncomingMessage,
  res: ServerResponse
) {
  const url = new URL(rawReq.url || "", `http://${rawReq.headers.host}`);
  const path = url.pathname;
  const method = rawReq.method || "GET";

  const key = `${method} ${path}`;
  let handler = routes[key];

  // Небольшой патч для динамических роутов, в идеале вынести это в отдельную утилиту
  // и сделать мастшабируемо
  if (!handler && path.startsWith("/products/")) {
    if (method === "PUT") handler = productController.update;
    if (method === "DELETE") handler = productController.delete;
  }

  let parsedBody: any = {};
  if (["POST", "PUT", "PATCH"].includes(method)) {
    const { ok, body } = await parseJsonBody(rawReq, res);
    if (!ok) return;

    parsedBody = body;
  }

  const req = new Request(rawReq, url, parsedBody);

  if (handler) return handler(req, res);

  json(res, 404, { message: "Not Found" });
}
