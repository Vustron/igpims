import type { NextRequest } from "next/server"

export function requestJson<T>(request: NextRequest): Promise<T> {
  return request.json() as Promise<T>
}
