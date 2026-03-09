/**
 * Supabase Edge Function 示例：安全处理 GET / 空 body，避免 "Unexpected end of JSON input"。
 * 部署后可用于 e2e 测试（EDGE_FUNCTION_NAME=hello）。
 *
 * 部署：supabase functions deploy hello --no-verify-jwt
 * 或复制到你的 Supabase 项目 supabase/functions/hello/index.ts
 */
// @ts-check
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req: Request) => {
  let name: string | undefined
  const method = req.method
  const contentType = req.headers.get("content-type") ?? ""

  if (method === "GET") {
    name = req.url
      ? (new URL(req.url).searchParams.get("name") ?? undefined)
      : undefined
  } else if (contentType.includes("application/json")) {
    try {
      const text = await req.text()
      if (text && text.trim().length > 0) {
        const body = JSON.parse(text) as { name?: string }
        name = body?.name
      }
    } catch {
      name = undefined
    }
  }

  const message = `Hello ${name ?? "World"}!`
  return new Response(JSON.stringify({ message }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
})
