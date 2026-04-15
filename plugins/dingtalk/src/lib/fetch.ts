const proxyUrl = process.env.HUB_HTTP_PROXY || undefined
const isBun = typeof Bun !== "undefined"

type FetchInput = Parameters<typeof globalThis.fetch>[0]
type FetchInit = Parameters<typeof globalThis.fetch>[1]

export function hubFetch(input: FetchInput, init?: FetchInit): Promise<Response> {
  if (proxyUrl && isBun) {
    return globalThis.fetch(input, { ...init, proxy: proxyUrl } as FetchInit)
  }
  return globalThis.fetch(input, init)
}

