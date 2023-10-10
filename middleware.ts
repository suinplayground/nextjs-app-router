import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("middleware", { method: request.method, url: request.url });
}
