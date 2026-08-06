import type { NextRequest } from "next/server";

const DEFAULT_GRAPHQL_ENDPOINT = "https://api.sektorelajanda.com/graphql";

export const dynamic = "force-dynamic";

function wordpressApiBase() {
  const graphqlEndpoint =
    process.env.WORDPRESS_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.trim() ||
    DEFAULT_GRAPHQL_ENDPOINT;

  return graphqlEndpoint.replace(/\/graphql\/?$/, "");
}

function errorResponse(message: string, status: number) {
  return Response.json(
    { message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

async function readUpstreamError(response: Response) {
  const text = await response.text();
  if (!text) return `CV isteği başarısız: ${response.status}`;

  try {
    const payload = JSON.parse(text) as { message?: string };
    return payload.message || `CV isteği başarısız: ${response.status}`;
  } catch {
    return text.length <= 300 ? text : `CV isteği başarısız: ${response.status}`;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) {
    return errorResponse("Geçersiz başvuru kimliği.", 400);
  }

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return errorResponse("CV dosyasına erişmek için giriş yapmanız gerekir.", 401);
  }

  const view = request.nextUrl.searchParams.get("view") === "1";
  const target = new URL(
    `/wp-json/sektorel/v1/job-applications/${id}/cv-v2`,
    `${wordpressApiBase()}/`,
  );
  if (view) target.searchParams.set("view", "1");

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: "GET",
      headers: {
        Authorization: authorization,
        Accept: "application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/octet-stream",
      },
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return errorResponse("CV sunucusuna ulaşılamadı.", 502);
  }

  if (!upstream.ok) {
    return errorResponse(await readUpstreamError(upstream), upstream.status);
  }

  const body = await upstream.arrayBuffer();
  const headers = new Headers({
    "Cache-Control": "private, no-store, max-age=0",
    "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });

  const disposition = upstream.headers.get("content-disposition");
  if (disposition) headers.set("Content-Disposition", disposition);
  headers.set("Content-Length", String(body.byteLength));

  return new Response(body, {
    status: 200,
    headers,
  });
}
