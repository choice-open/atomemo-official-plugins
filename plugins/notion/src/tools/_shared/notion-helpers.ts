import type {
  CreatePageParameters,
  QueryDataSourceParameters,
  SearchParameters,
  UpdatePageParameters,
} from "@notionhq/client"
import { APIResponseError, Client } from "@notionhq/client"

type GenericRecord = Record<string, unknown>

const isRecord = (value: unknown): value is GenericRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export type NotionToolArgs = {
  parameters: Record<string, unknown>
  credentials?: Record<string, { api_key: string }>
}

/**
 * Resolves the Notion API client using the credential referenced by
 * parameters[credentialIdParamKey]. Follows Atomemo credential usage:
 * credential = credentials[parameters[credentialIdParamKey]]
 */
export const getNotionClient = (
  args: NotionToolArgs,
  credentialIdParamKey: string = "api_key",
): Client | null => {
  const credentials = args.credentials
  if (!credentials || typeof credentials !== "object") {
    return null
  }

  const credentialId = args.parameters[credentialIdParamKey]
  if (typeof credentialId !== "string" || credentialId.trim() === "") {
    return null
  }

  const credential = credentials[credentialId]
  const apiKey = credential?.api_key
  if (typeof apiKey !== "string" || apiKey.trim() === "") {
    return null
  }

  return new Client({ auth: apiKey })
}

export const formatNotionError = (error: unknown) => {
  if (APIResponseError.isAPIResponseError(error)) {
    return `${error.code}: ${error.message}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Unknown error"
}

/** Result type for tool invoke: success with data or failure with error message. */
export type NotionToolResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export const okResult = <T>(data: T): NotionToolResult<T> => ({
  ok: true,
  data,
})
export const errResult = (error: string): NotionToolResult<never> => ({
  ok: false,
  error,
})

const INVOKE_ERROR_PREFIX = "[Invoke] "

/** Use in tool invoke handlers to return errors with a prefix indicating they come from invoke. */
export const invokeErrResult = (error: string): NotionToolResult<never> =>
  errResult(INVOKE_ERROR_PREFIX + error)

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

const toJsonSafe = (value: unknown): JsonValue => {
  if (value === null) {
    return null
  }

  if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  ) {
    return value
  }

  if (typeof value === "number") {
    return null
  }

  if (typeof value === "bigint") {
    return value.toString()
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    return value.map((item) => toJsonSafe(item))
  }

  if (typeof value === "object" && value !== null) {
    const withToJson = value as { toJSON?: () => unknown }
    if (typeof withToJson.toJSON === "function") {
      return toJsonSafe(withToJson.toJSON())
    }

    const result: Record<string, JsonValue> = {}
    for (const [key, item] of Object.entries(value)) {
      if (
        item === undefined ||
        typeof item === "function" ||
        typeof item === "symbol"
      ) {
        continue
      }
      result[key] = toJsonSafe(item)
    }
    return result
  }

  return String(value)
}

const extractRichTextPlainText = (value: unknown): string | undefined => {
  if (!Array.isArray(value)) {
    return undefined
  }

  const parts = value
    .map((item) =>
      isRecord(item) && typeof item.plain_text === "string"
        ? item.plain_text
        : "",
    )
    .filter((part) => part !== "")

  return parts.length > 0 ? parts.join("") : undefined
}

const simplifyParent = (value: unknown): JsonValue => {
  if (!isRecord(value)) {
    return toJsonSafe(value)
  }

  const parent: Record<string, JsonValue> = {}
  if (typeof value.type === "string") {
    parent.type = value.type
    const typedId = value[`${value.type}_id`]
    if (typeof typedId === "string") {
      parent.id = typedId
    }
  }

  if (typeof value.page_id === "string") {
    parent.id = value.page_id
  } else if (typeof value.data_source_id === "string") {
    parent.id = value.data_source_id
  } else if (typeof value.database_id === "string") {
    parent.id = value.database_id
  } else if (typeof value.block_id === "string") {
    parent.id = value.block_id
  }

  return Object.keys(parent).length > 0 ? parent : toJsonSafe(value)
}

const simplifyUser = (value: unknown): JsonValue => {
  if (!isRecord(value)) {
    return toJsonSafe(value)
  }

  return {
    id: typeof value.id === "string" ? value.id : null,
    name: typeof value.name === "string" ? value.name : null,
    type: typeof value.type === "string" ? value.type : null,
  }
}

const simplifyPropertyValue = (value: unknown): JsonValue => {
  if (!isRecord(value)) {
    return toJsonSafe(value)
  }

  const type = typeof value.type === "string" ? value.type : undefined
  if (!type) {
    return toJsonSafe(value)
  }

  const typedValue = value[type]
  switch (type) {
    case "title":
    case "rich_text":
      return extractRichTextPlainText(typedValue) ?? ""
    case "number":
    case "checkbox":
    case "url":
    case "email":
    case "phone_number":
      return toJsonSafe(typedValue)
    case "select":
    case "status":
      return isRecord(typedValue) ? toJsonSafe(typedValue.name ?? null) : null
    case "multi_select":
      return Array.isArray(typedValue)
        ? typedValue.map((item) =>
            isRecord(item) ? toJsonSafe(item.name ?? null) : null,
          )
        : []
    case "people":
      return Array.isArray(typedValue)
        ? typedValue.map((item) => simplifyUser(item))
        : []
    case "relation":
      return Array.isArray(typedValue)
        ? typedValue.map((item) =>
            isRecord(item) && typeof item.id === "string"
              ? item.id
              : toJsonSafe(item),
          )
        : []
    case "date":
      return isRecord(typedValue)
        ? {
            start: toJsonSafe(typedValue.start ?? null),
            end: toJsonSafe(typedValue.end ?? null),
            time_zone: toJsonSafe(typedValue.time_zone ?? null),
          }
        : null
    case "files":
      return Array.isArray(typedValue)
        ? typedValue.map((item) => {
            if (!isRecord(item)) {
              return toJsonSafe(item)
            }

            const fileType = typeof item.type === "string" ? item.type : ""
            const source = isRecord(item[fileType]) ? item[fileType] : undefined
            return {
              name: toJsonSafe(item.name ?? null),
              type: toJsonSafe(fileType || null),
              url: source ? toJsonSafe(source.url ?? null) : null,
            }
          })
        : []
    case "created_by":
    case "last_edited_by":
      return simplifyUser(typedValue)
    default:
      return toJsonSafe(typedValue ?? value)
  }
}

const simplifyPage = (value: Record<string, unknown>): JsonValue => {
  const properties = isRecord(value.properties) ? value.properties : {}
  const propertiesFlat: Record<string, JsonValue> = {}

  let titleText: string | undefined
  for (const [propertyName, propertyValue] of Object.entries(properties)) {
    propertiesFlat[propertyName] = simplifyPropertyValue(propertyValue)
    if (titleText === undefined && isRecord(propertyValue)) {
      const type = propertyValue.type
      if (type === "title") {
        titleText = extractRichTextPlainText(propertyValue.title)
      }
    }
  }

  return {
    id: toJsonSafe(value.id ?? null),
    object: toJsonSafe(value.object ?? "page"),
    url: toJsonSafe(value.url ?? null),
    created_time: toJsonSafe(value.created_time ?? null),
    last_edited_time: toJsonSafe(value.last_edited_time ?? null),
    archived: toJsonSafe(value.archived ?? null),
    in_trash: toJsonSafe(value.in_trash ?? null),
    parent: simplifyParent(value.parent),
    title_text: toJsonSafe(titleText ?? null),
    properties_flat: propertiesFlat,
  }
}

const simplifyDataSource = (value: Record<string, unknown>): JsonValue => {
  const properties = isRecord(value.properties) ? value.properties : {}
  const propertiesSummary: Record<string, JsonValue> = {}

  for (const [propertyName, propertyValue] of Object.entries(properties)) {
    if (!isRecord(propertyValue)) {
      propertiesSummary[propertyName] = toJsonSafe(propertyValue)
      continue
    }

    propertiesSummary[propertyName] = {
      id: toJsonSafe(propertyValue.id ?? null),
      type: toJsonSafe(propertyValue.type ?? null),
    }
  }

  return {
    id: toJsonSafe(value.id ?? null),
    object: toJsonSafe(value.object ?? null),
    url: toJsonSafe(value.url ?? null),
    title_text: toJsonSafe(extractRichTextPlainText(value.title) ?? null),
    description_text: toJsonSafe(
      extractRichTextPlainText(value.description) ?? null,
    ),
    properties_summary: propertiesSummary,
  }
}

const simplifyBlockContent = (blockType: string, value: unknown): JsonValue => {
  if (!isRecord(value)) {
    return toJsonSafe(value)
  }

  const content: Record<string, JsonValue> = {}
  for (const [key, item] of Object.entries(value)) {
    if (key === "rich_text" || key === "caption" || key === "title") {
      content[`${key}_text`] = toJsonSafe(
        extractRichTextPlainText(item) ?? null,
      )
      continue
    }

    if (key === "children" && Array.isArray(item)) {
      content.children_count = item.length
      continue
    }

    if (key === "text" && isRecord(item)) {
      content.text = toJsonSafe(item.content ?? item.plain_text ?? item)
      continue
    }

    content[key] = toJsonSafe(item)
  }

  content.type = blockType
  return content
}

const simplifyBlock = (value: Record<string, unknown>): JsonValue => {
  const type = typeof value.type === "string" ? value.type : "unknown"
  const typedContent = value[type]
  const plainText =
    extractRichTextPlainText(
      isRecord(typedContent) ? typedContent.rich_text : undefined,
    ) ??
    extractRichTextPlainText(
      isRecord(typedContent) ? typedContent.caption : undefined,
    ) ??
    (isRecord(typedContent) && isRecord(typedContent.text)
      ? ((typedContent.text.plain_text as string | undefined) ??
        (typedContent.text.content as string | undefined))
      : undefined)

  return {
    id: toJsonSafe(value.id ?? null),
    object: toJsonSafe(value.object ?? "block"),
    type: toJsonSafe(type),
    has_children: toJsonSafe(value.has_children ?? false),
    created_time: toJsonSafe(value.created_time ?? null),
    last_edited_time: toJsonSafe(value.last_edited_time ?? null),
    plain_text: toJsonSafe(plainText ?? null),
    content: simplifyBlockContent(type, typedContent),
  }
}

const simplifyListResponse = (value: Record<string, unknown>): JsonValue => {
  const results = Array.isArray(value.results) ? value.results : []

  return {
    object: toJsonSafe(value.object ?? "list"),
    type: toJsonSafe(value.type ?? null),
    has_more: toJsonSafe(value.has_more ?? false),
    next_cursor: toJsonSafe(value.next_cursor ?? null),
    results: results.map((item) => simplifyNotionEntity(item)),
  }
}

const simplifyNotionEntity = (value: unknown): JsonValue => {
  if (!isRecord(value)) {
    return toJsonSafe(value)
  }

  const objectType = value.object
  if (objectType === "list" && Array.isArray(value.results)) {
    return simplifyListResponse(value)
  }
  if (objectType === "page") {
    return simplifyPage(value)
  }
  if (objectType === "database" || objectType === "data_source") {
    return simplifyDataSource(value)
  }
  if (objectType === "block") {
    return simplifyBlock(value)
  }

  return toJsonSafe(value)
}

export const getSimplifyOutputFlag = (
  rawParameters: Record<string, unknown>,
): boolean =>
  typeof rawParameters.simplify_output === "boolean"
    ? rawParameters.simplify_output
    : true

export const transformNotionOutput = (
  rawData: unknown,
  simplifyOutput: boolean,
): JsonValue => {
  if (!simplifyOutput) {
    return rawData as JsonValue
  }

  return simplifyNotionEntity(rawData)
}

const isValidLinkValue = (
  linkValue: unknown,
): linkValue is string | { url: string } =>
  (typeof linkValue === "string" && linkValue.trim() !== "") ||
  (isRecord(linkValue) &&
    typeof linkValue.url === "string" &&
    (linkValue.url as string).trim() !== "")

const normalizeTextObject = (value: unknown) => {
  if (typeof value === "string") {
    return { content: value }
  }

  if (!isRecord(value)) {
    return value
  }

  const linkValue = value.link
  const link = isValidLinkValue(linkValue)
    ? typeof linkValue === "string"
      ? { url: linkValue }
      : { url: (linkValue as { url: string }).url }
    : undefined

  const { link: _link, ...rest } = value
  return {
    ...rest,
    ...(link !== undefined ? { link } : {}),
  }
}

const normalizeRichTextItem = (value: unknown) => {
  if (!isRecord(value)) {
    return value
  }

  const hasText = Object.hasOwn(value, "text")
  const nextType =
    typeof value.type === "string" ? value.type : hasText ? "text" : undefined
  const nextText = hasText ? normalizeTextObject(value.text) : value.text

  return {
    ...value,
    ...(nextType ? { type: nextType } : {}),
    ...(hasText ? { text: nextText } : {}),
  }
}

const normalizeRichTextArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return value
  }

  return value.map(normalizeRichTextItem)
}

const normalizeBlockContent = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeBlockContent)
  }

  if (!isRecord(value)) {
    return value
  }

  const result: GenericRecord = {}

  for (const [key, itemValue] of Object.entries(value)) {
    if (key === "rich_text" || key === "caption" || key === "title") {
      result[key] = normalizeRichTextArray(itemValue)
      continue
    }

    if (key === "text") {
      result[key] = normalizeTextObject(itemValue)
      continue
    }

    if (key === "children" && Array.isArray(itemValue)) {
      result[key] = itemValue.map((child) => normalizeBlockContent(child))
      continue
    }

    if (key === "link" && typeof itemValue === "string") {
      result[key] = { url: itemValue }
      continue
    }

    result[key] = normalizeBlockContent(itemValue)
  }

  return result
}

export const mapBlocks = (
  value: unknown,
): CreatePageParameters["children"] | undefined => {
  if (!Array.isArray(value)) {
    return undefined
  }

  return value.map((item) =>
    normalizeBlockContent(item),
  ) as CreatePageParameters["children"]
}

const normalizePropertyValue = (value: unknown) => {
  if (!isRecord(value)) {
    return value
  }

  const type = typeof value.type === "string" ? value.type : undefined
  if (!type) {
    return value
  }

  if (type === "title" || type === "rich_text") {
    return {
      ...value,
      [type]: normalizeRichTextArray(value[type]),
    }
  }

  return value
}

export const mapPageProperties = (
  value: unknown,
):
  | CreatePageParameters["properties"]
  | UpdatePageParameters["properties"]
  | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  const mapped: GenericRecord = {}
  for (const [key, propertyValue] of Object.entries(value)) {
    mapped[key] = normalizePropertyValue(propertyValue)
  }

  return mapped as CreatePageParameters["properties"]
}

export const mapIcon = (value: unknown) => {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined
  }

  return {
    type: "emoji",
    emoji: value.trim(),
  } as const
}

export const mapQuerySorts = (
  value: unknown,
): QueryDataSourceParameters["sorts"] | undefined => {
  if (!Array.isArray(value) || value.length === 0) {
    return undefined
  }

  const mapped = value
    .filter(isRecord)
    .map((item) => {
      const direction =
        item.direction === "ascending" ? "ascending" : "descending"

      if (
        item.timestamp === "created_time" ||
        item.timestamp === "last_edited_time"
      ) {
        return {
          direction,
          timestamp: item.timestamp,
        }
      }

      if (typeof item.property === "string" && item.property.trim() !== "") {
        return {
          direction,
          property: item.property,
        }
      }

      return undefined
    })
    .filter((item) => item !== undefined)

  return mapped.length > 0
    ? (mapped as QueryDataSourceParameters["sorts"])
    : undefined
}

export const mapSearchSort = (
  value: unknown,
): SearchParameters["sort"] | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  const direction = value.direction === "ascending" ? "ascending" : "descending"
  const timestamp =
    value.timestamp === "last_edited_time" ? value.timestamp : undefined
  if (!timestamp) {
    return undefined
  }

  return {
    direction,
    timestamp,
  }
}

export const parseJsonObject = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return {
      value: undefined as QueryDataSourceParameters["filter"] | undefined,
    }
  }

  if (typeof value !== "string") {
    return { error: "Invalid filter JSON: expected a string" }
  }

  try {
    const parsed = JSON.parse(value)
    if (!isRecord(parsed)) {
      return { error: "Invalid filter JSON: expected a JSON object" }
    }

    return { value: parsed as QueryDataSourceParameters["filter"] }
  } catch {
    return { error: "Invalid filter JSON" }
  }
}

export const queryWithPagination = async <
  T extends {
    has_more: boolean
    next_cursor: string | null
    results: unknown[]
  },
>(
  returnAll: boolean,
  fetchPage: (startCursor?: string) => Promise<T>,
) => {
  const first = await fetchPage()
  if (!returnAll || !first.has_more || !first.next_cursor) {
    return first
  }

  const results = [...first.results]
  let cursor: string | undefined = first.next_cursor
  let last = first

  while (cursor) {
    const current = await fetchPage(cursor)
    results.push(...current.results)
    last = current
    cursor =
      current.has_more && current.next_cursor ? current.next_cursor : undefined
  }

  return {
    ...last,
    has_more: false,
    next_cursor: null,
    results,
  } as T
}
