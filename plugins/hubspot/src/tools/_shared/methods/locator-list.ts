import type { ToolLocatorListFunction } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getHubSpotClient } from "../utils"

type LocatorCtx = Parameters<ToolLocatorListFunction>[0]

const LOCATOR_PAGE_SIZE = 50

type PagingResponse = {
  paging?: {
    next?: {
      after?: string | null
    } | null
  } | null
}

function normalizeFilter(filter?: string | null): string | undefined {
  const trimmed = filter?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

function matchesFilter(
  filter: string | undefined,
  ...candidates: Array<string | null | undefined>
): boolean {
  if (!filter) return true
  const normalized = filter.toLowerCase()
  return candidates.some((candidate) =>
    candidate?.toLowerCase().includes(normalized),
  )
}

function buildPath(
  pathname: string,
  query: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue
    search.set(key, String(value))
  }
  const queryString = search.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
}

async function parseJson<T>(
  input: LocatorCtx,
  request: {
    method: "GET" | "POST"
    path: string
    body?: Record<string, unknown>
  },
): Promise<T> {
  const client = getHubSpotClient({
    parameters: input.parameters,
    credentials: input.credentials,
  })
  const response = await client.apiRequest(request)
  return (await response.json()) as T
}

export const hubspotLocatorListMethods = {
  async search_workflows(input: LocatorCtx) {
    const data = await parseJson<
      PagingResponse & {
        results?: Array<{
          id?: string
          name?: string
          objectTypeId?: string
        }>
      }
    >(input, {
      method: "GET",
      path: buildPath("/automation/v4/flows", {
        after: input.pagination_token ?? undefined,
        limit: LOCATOR_PAGE_SIZE,
      }),
    })

    const filter = normalizeFilter(input.filter)
    return {
      results:
        data.results
          ?.filter((workflow) =>
            matchesFilter(
              filter,
              workflow.name,
              workflow.id,
              workflow.objectTypeId,
            ),
          )
          .map((workflow) => ({
            label: workflow.name
              ? `${workflow.name} (${workflow.id ?? "unknown"})`
              : (workflow.id ?? "Unknown workflow"),
            value: workflow.id ?? "",
            url: null,
          })) ?? [],
      pagination_token: data.paging?.next?.after ?? null,
    }
  },

  async search_lists(input: LocatorCtx) {
    const offset = Number(input.pagination_token ?? 0)
    const data = await parseJson<{
      hasMore?: boolean
      lists?: Array<{
        listId?: string
        name?: string
        objectTypeId?: string
      }>
      offset?: number
    }>(input, {
      method: "POST",
      path: "/crm/v3/lists/search",
      body: {
        count: LOCATOR_PAGE_SIZE,
        offset: Number.isFinite(offset) ? offset : 0,
        query: normalizeFilter(input.filter) ?? "",
      },
    })

    return {
      results:
        data.lists?.map((list) => ({
          label: list.name
            ? `${list.name} (${list.listId ?? "unknown"})`
            : (list.listId ?? "Unknown list"),
          value: list.listId ?? "",
          url: null,
        })) ?? [],
      pagination_token: data.hasMore ? String(data.offset ?? 0) : null,
    }
  },

  async search_owners(input: LocatorCtx) {
    const data = await parseJson<
      PagingResponse & {
        results?: Array<{
          id?: string
          email?: string
          firstName?: string
          lastName?: string
        }>
      }
    >(input, {
      method: "GET",
      path: buildPath("/crm/owners/2026-03", {
        after: input.pagination_token ?? undefined,
        limit: LOCATOR_PAGE_SIZE,
      }),
    })

    const filter = normalizeFilter(input.filter)
    return {
      results:
        data.results
          ?.filter((owner) =>
            matchesFilter(
              filter,
              owner.id,
              owner.email,
              [owner.firstName, owner.lastName].filter(Boolean).join(" "),
            ),
          )
          .map((owner) => {
            const name =
              [owner.firstName, owner.lastName].filter(Boolean).join(" ") ||
              owner.email ||
              owner.id ||
              "Unknown owner"

            return {
              label: owner.email ? `${name} (${owner.email})` : name,
              value: owner.id ?? "",
              url: null,
            }
          }) ?? [],
      pagination_token: data.paging?.next?.after ?? null,
    }
  },

  async search_files(input: LocatorCtx) {
    const filter = normalizeFilter(input.filter)
    const data = await parseJson<
      PagingResponse & {
        results?: Array<{
          id?: string
          name?: string
          url?: string
          path?: string
        }>
      }
    >(input, {
      method: "GET",
      path: buildPath("/files/v3/files/search", {
        after: input.pagination_token ?? undefined,
        limit: LOCATOR_PAGE_SIZE,
        name: filter,
      }),
    })

    return {
      results:
        data.results?.map((file) => ({
          label: file.name ? `${file.name} (${file.id ?? "unknown"})` : (file.id ?? "Unknown file"),
          value: file.id ?? "",
          url: file.url ?? file.path ?? null,
        })) ?? [],
      pagination_token: data.paging?.next?.after ?? null,
    }
  },

  async search_folders(input: LocatorCtx) {
    const filter = normalizeFilter(input.filter)
    const data = await parseJson<
      PagingResponse & {
        results?: Array<{
          id?: string
          name?: string
          path?: string
        }>
      }
    >(input, {
      method: "GET",
      path: buildPath("/files/v3/folders/search", {
        after: input.pagination_token ?? undefined,
        limit: LOCATOR_PAGE_SIZE,
        name: filter,
      }),
    })

    return {
      results:
        data.results?.map((folder) => ({
          label: folder.path || folder.name || folder.id || "Unknown folder",
          value: folder.id ?? "",
          url: folder.path ?? null,
        })) ?? [],
      pagination_token: data.paging?.next?.after ?? null,
    }
  },
}
