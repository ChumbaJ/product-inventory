import { IncomingMessage, ServerResponse } from "http";
import { config } from "../config";
import { json } from "./response";

export async function readBody(req: IncomingMessage) {
  let body = "";
  let total = 0;

  // ограничение body, чтобы не засорить буфер
  for await (const chunk of req) {
    const buf: Buffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
    total += buf.length;

    if (total > config.body.maxSize) {
      throw new Error("Body too large");
    }

    body += chunk;
  }

  return body;
}
/**
 * эта функция парсит body и если есть ошибки то возвращает их клиенту
 */
export async function parseJsonBody(
  rawReq: IncomingMessage,
  res: ServerResponse
): Promise<{ ok: boolean; body?: any }> {
  let rawBody = "";

  try {
    rawBody = await readBody(rawReq);
  } catch (error) {
    if (error instanceof Error && error.message === "Body too large") {
      json(res, 413, { message: "Payload Too Large" });
      return { ok: false };
    }

    console.error("failed to read body", error);
    json(res, 400, { message: "Invalid request body" });
    return { ok: false };
  }

  if (!rawBody) return { ok: true, body: {} };

  try {
    const parsed = JSON.parse(rawBody);
    return { ok: true, body: parsed };
  } catch (error) {
    console.error("failed to parse json", error);
    json(res, 400, { message: "Invalid JSON" });
    return { ok: false };
  }
}
