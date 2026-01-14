import { RemixServer } from "@remix-run/react";
import { renderToReadableStream } from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: any
) {
  return new Response(
    renderToReadableStream(
      <RemixServer context={remixContext} url={request.url} />
    ),
    {
      status: responseStatusCode,
      headers: responseHeaders,
    }
  );
}
