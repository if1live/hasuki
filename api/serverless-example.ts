import type { VercelRequest, VercelResponse } from "@vercel/node";

/*
pnpm vercel dev
http://localhost:3000/api/serverless-example?query=123
*/

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}
