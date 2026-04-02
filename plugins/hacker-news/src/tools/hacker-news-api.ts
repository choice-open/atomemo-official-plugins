const API_BASE_URL = "http://hn.algolia.com/api/v1"

const SEARCH_ITEM_TAG_PRIORITY = [
  "story",
  "comment",
  "poll",
  "job",
  "pollopt",
  "show_hn",
  "ask_hn",
  "front_page",
] as const

type SearchHit = {
  objectID?: string
  type?: string
  _tags?: string[]
  title?: string | null
  url?: string | null
  author?: string | null
  created_at?: string
  created_at_i?: number
  points?: number | null
  num_comments?: number | null
  story_text?: string | null
  comment_text?: string | null
  story_id?: number | null
  story_title?: string | null
  story_url?: string | null
}

type ItemResponse = {
  id?: number
  type?: string
  title?: string | null
  url?: string | null
  author?: string | null
  created_at?: string
  created_at_i?: number
  points?: number | null
  text?: string | null
  parent_id?: number | null
  parent?: number | null
  children?: ItemResponse[]
}

type UserResponse = {
  username?: string
  karma?: number | null
  about?: string | null
}

export type SearchItem = {
  id: string | null
  type: string | null
  title: string | null
  url: string | null
  author: string | null
  created_at: string | null
  points: number | null
  comment_count: number | null
  text: string | null
  story_id?: number
  story_title?: string
  story_url?: string
}

export type NormalizedItem = {
  id: number | null
  type: string | null
  title: string | null
  url: string | null
  author: string | null
  created_at: string | null
  points: number | null
  text: string | null
  parent_id: number | null
  children_count: number
}

export type NormalizedComment = {
  id: number | null
  author: string | null
  text: string | null
  created_at: string | null
  parent_id: number | null
  children_count: number
  children: NormalizedComment[]
}

export type NormalizedUser = {
  username: string | null
  karma: number | null
  about: string | null
}

export async function hackerNewsApiRequest(
  endpoint: string,
  qs: Record<string, unknown> = {},
) {
  const url = new URL(`${API_BASE_URL}/${endpoint}`)
  for (const [key, value] of Object.entries(qs)) {
    if (value == null || value === "") continue
    url.searchParams.set(key, String(value))
  }

  const response = await fetch(url.toString(), { method: "GET" })
  if (!response.ok) {
    throw new Error(
      `Hacker News API error: ${response.status} ${response.statusText}`,
    )
  }

  return response.json() as Promise<any>
}

function normalizeCreatedAt(value?: string, epoch?: number) {
  if (value) {
    return value
  }

  if (typeof epoch === "number") {
    return new Date(epoch * 1000).toISOString()
  }

  return null
}

function normalizeString(value?: string | null) {
  return typeof value === "string" && value.length > 0 ? value : null
}

function normalizeNumber(value?: number | null) {
  return typeof value === "number" ? value : null
}

function inferSearchItemType(hit: SearchHit) {
  if (typeof hit.type === "string" && hit.type.length > 0) {
    return hit.type
  }

  const matchedTag = SEARCH_ITEM_TAG_PRIORITY.find((tag) =>
    hit._tags?.includes(tag),
  )

  return matchedTag ?? null
}

export function normalizeSearchItem(hit: SearchHit): SearchItem {
  const storyId = normalizeNumber(hit.story_id)
  const storyTitle = normalizeString(hit.story_title)
  const storyUrl = normalizeString(hit.story_url)

  return {
    id: normalizeString(hit.objectID),
    type: inferSearchItemType(hit),
    title: normalizeString(hit.title),
    url: normalizeString(hit.url),
    author: normalizeString(hit.author),
    created_at: normalizeCreatedAt(hit.created_at, hit.created_at_i),
    points: normalizeNumber(hit.points),
    comment_count: normalizeNumber(hit.num_comments),
    text: normalizeString(hit.comment_text) ?? normalizeString(hit.story_text),
    ...(storyId !== null ? { story_id: storyId } : {}),
    ...(storyTitle ? { story_title: storyTitle } : {}),
    ...(storyUrl ? { story_url: storyUrl } : {}),
  }
}

export function normalizeItem(item: ItemResponse): NormalizedItem {
  return {
    id: typeof item.id === "number" ? item.id : null,
    type: normalizeString(item.type),
    title: normalizeString(item.title),
    url: normalizeString(item.url),
    author: normalizeString(item.author),
    created_at: normalizeCreatedAt(item.created_at, item.created_at_i),
    points: normalizeNumber(item.points),
    text: normalizeString(item.text),
    parent_id: normalizeNumber(item.parent_id ?? item.parent),
    children_count: Array.isArray(item.children) ? item.children.length : 0,
  }
}

export function normalizeComment(comment: ItemResponse): NormalizedComment {
  const children = Array.isArray(comment.children)
    ? comment.children.map(normalizeComment)
    : []

  return {
    id: typeof comment.id === "number" ? comment.id : null,
    author: normalizeString(comment.author),
    text: normalizeString(comment.text),
    created_at: normalizeCreatedAt(comment.created_at, comment.created_at_i),
    parent_id: normalizeNumber(comment.parent_id ?? comment.parent),
    children_count: children.length,
    children,
  }
}

export function normalizeUser(user: UserResponse): NormalizedUser {
  return {
    username: normalizeString(user.username),
    karma: normalizeNumber(user.karma),
    about: normalizeString(user.about),
  }
}
