import { IncomingMessage } from "node:http"

export interface CompatibleRequest extends IncomingMessage {
  headers: Record<string, string | string[]>
  url: string
  method: string
}
