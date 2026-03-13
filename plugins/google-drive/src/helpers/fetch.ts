/**
 * Fetch abstraction that uses HUB_HTTP_PROXY when set (Bun only; Node uses fetch without proxy).
 * Use this instead of global fetch for all outbound HTTP so hub proxy is respected in Bun.
 */

const proxyUrl = process.env.HUB_HTTP_PROXY || undefined
const isBun = typeof Bun !== "undefined"

type FetchInput = Parameters<typeof globalThis.fetch>[0]
type FetchInit = Parameters<typeof globalThis.fetch>[1]

/**
 * Fetch that routes through HUB_HTTP_PROXY when set in Bun. Same signature as global fetch.
 */
export function hubFetch(input: FetchInput, init?: FetchInit): Promise<Response> {
  if (proxyUrl && isBun) {
    return globalThis.fetch(input, { ...init, proxy: proxyUrl } as FetchInit)
  }
  return globalThis.fetch(input, init)
}
