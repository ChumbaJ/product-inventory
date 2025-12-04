import { IncomingMessage } from "http";

export class Request {
  constructor(
    public raw: IncomingMessage,
    public url: URL,
    public body: any
  ) {}
}
