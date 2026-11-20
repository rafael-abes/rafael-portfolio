// Some browsers request /favicon.ico regardless of the <link rel="icon"> tag; point them at the SVG icon.
export function GET() {
  return new Response(null, { status: 308, headers: { Location: "/icon.svg" } });
}
