import type {
  CreatePageParameters,
  QueryDataSourceParameters,
  SearchParameters,
  UpdatePageParameters,
} from "@notionhq/client";
import { APIResponseError, Client } from "@notionhq/client";

type GenericRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is GenericRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export type NotionToolArgs = {
  parameters: Record<string, unknown>;
  credentials?: Record<string, { api_key: string }>;
};

/**
 * Resolves the Notion API client using the credential referenced by
 * parameters[credentialIdParamKey]. Follows Atomemo credential usage:
 * credential = credentials[parameters[credentialIdParamKey]]
 */
export const getNotionClient = (
  args: NotionToolArgs,
  credentialIdParamKey: string = "api_key",
): Client | null => {
  const credentials = args.credentials;
  if (!credentials || typeof credentials !== "object") {
    return null;
  }

  const credentialId = args.parameters[credentialIdParamKey];
  if (typeof credentialId !== "string" || credentialId.trim() === "") {
    return null;
  }

  const credential = credentials[credentialId];
  const apiKey = credential?.api_key;
  if (typeof apiKey !== "string" || apiKey.trim() === "") {
    return null;
  }

  return new Client({ auth: apiKey });
};

export const formatNotionError = (error: unknown) => {
  if (APIResponseError.isAPIResponseError(error)) {
    return `${error.code}: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
};

/** Result type for tool invoke: success with data or failure with error message. */
export type NotionToolResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export const okResult = <T>(data: T): NotionToolResult<T> => ({ ok: true, data });
export const errResult = (error: string): NotionToolResult<never> => ({
  ok: false,
  error,
});

const INVOKE_ERROR_PREFIX = "[Invoke] ";

/** Use in tool invoke handlers to return errors with a prefix indicating they come from invoke. */
export const invokeErrResult = (error: string): NotionToolResult<never> =>
  errResult(INVOKE_ERROR_PREFIX + error);

const isValidLinkValue = (linkValue: unknown): linkValue is string | { url: string } =>
  (typeof linkValue === "string" && linkValue.trim() !== "") ||
  (isRecord(linkValue) && typeof linkValue.url === "string" && (linkValue.url as string).trim() !== "");

const normalizeTextObject = (value: unknown) => {
  if (typeof value === "string") {
    return { content: value };
  }

  if (!isRecord(value)) {
    return value;
  }

  const linkValue = value.link;
  const link = isValidLinkValue(linkValue)
    ? typeof linkValue === "string"
      ? { url: linkValue }
      : { url: (linkValue as { url: string }).url }
    : undefined;

  const { link: _link, ...rest } = value;
  return {
    ...rest,
    ...(link !== undefined ? { link } : {}),
  };
};

const normalizeRichTextItem = (value: unknown) => {
  if (!isRecord(value)) {
    return value;
  }

  const hasText = Object.hasOwn(value, "text");
  const nextType =
    typeof value.type === "string" ? value.type : hasText ? "text" : undefined;
  const nextText = hasText ? normalizeTextObject(value.text) : value.text;

  return {
    ...value,
    ...(nextType ? { type: nextType } : {}),
    ...(hasText ? { text: nextText } : {}),
  };
};

const normalizeRichTextArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return value;
  }

  return value.map(normalizeRichTextItem);
};

const normalizeBlockContent = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeBlockContent);
  }

  if (!isRecord(value)) {
    return value;
  }

  const result: GenericRecord = {};

  for (const [key, itemValue] of Object.entries(value)) {
    if (key === "rich_text" || key === "caption" || key === "title") {
      result[key] = normalizeRichTextArray(itemValue);
      continue;
    }

    if (key === "text") {
      result[key] = normalizeTextObject(itemValue);
      continue;
    }

    if (key === "children" && Array.isArray(itemValue)) {
      result[key] = itemValue.map((child) => normalizeBlockContent(child));
      continue;
    }

    if (key === "link" && typeof itemValue === "string") {
      result[key] = { url: itemValue };
      continue;
    }

    result[key] = normalizeBlockContent(itemValue);
  }

  return result;
};

export const mapBlocks = (
  value: unknown,
): CreatePageParameters["children"] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.map((item) =>
    normalizeBlockContent(item),
  ) as CreatePageParameters["children"];
};

const normalizePropertyValue = (value: unknown) => {
  if (!isRecord(value)) {
    return value;
  }

  const type = typeof value.type === "string" ? value.type : undefined;
  if (!type) {
    return value;
  }

  if (type === "title" || type === "rich_text") {
    return {
      ...value,
      [type]: normalizeRichTextArray(value[type]),
    };
  }

  return value;
};

export const mapPageProperties = (
  value: unknown,
):
  | CreatePageParameters["properties"]
  | UpdatePageParameters["properties"]
  | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const mapped: GenericRecord = {};
  for (const [key, propertyValue] of Object.entries(value)) {
    mapped[key] = normalizePropertyValue(propertyValue);
  }

  return mapped as CreatePageParameters["properties"];
};

export const mapIcon = (value: unknown) => {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  return {
    type: "emoji",
    emoji: value.trim(),
  } as const;
};

export const mapQuerySorts = (
  value: unknown,
): QueryDataSourceParameters["sorts"] | undefined => {
  if (!Array.isArray(value) || value.length === 0) {
    return undefined;
  }

  const mapped = value
    .filter(isRecord)
    .map((item) => {
      const direction =
        item.direction === "ascending" ? "ascending" : "descending";

      if (
        item.timestamp === "created_time" ||
        item.timestamp === "last_edited_time"
      ) {
        return {
          direction,
          timestamp: item.timestamp,
        };
      }

      if (typeof item.property === "string" && item.property.trim() !== "") {
        return {
          direction,
          property: item.property,
        };
      }

      return undefined;
    })
    .filter((item) => item !== undefined);

  return mapped.length > 0
    ? (mapped as QueryDataSourceParameters["sorts"])
    : undefined;
};

export const mapSearchSort = (
  value: unknown,
): SearchParameters["sort"] | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const direction =
    value.direction === "ascending" ? "ascending" : "descending";
  const timestamp =
    value.timestamp === "last_edited_time" ? value.timestamp : undefined;
  if (!timestamp) {
    return undefined;
  }

  return {
    direction,
    timestamp,
  };
};

export const parseJsonObject = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return {
      value: undefined as QueryDataSourceParameters["filter"] | undefined,
    };
  }

  if (typeof value !== "string") {
    return { error: "Invalid filter JSON: expected a string" };
  }

  try {
    const parsed = JSON.parse(value);
    if (!isRecord(parsed)) {
      return { error: "Invalid filter JSON: expected a JSON object" };
    }

    return { value: parsed as QueryDataSourceParameters["filter"] };
  } catch {
    return { error: "Invalid filter JSON" };
  }
};

export const queryWithPagination = async <
  T extends {
    has_more: boolean;
    next_cursor: string | null;
    results: unknown[];
  },
>(
  returnAll: boolean,
  fetchPage: (startCursor?: string) => Promise<T>,
) => {
  const first = await fetchPage();
  if (!returnAll || !first.has_more || !first.next_cursor) {
    return first;
  }

  const results = [...first.results];
  let cursor: string | undefined = first.next_cursor;
  let last = first;

  while (cursor) {
    const current = await fetchPage(cursor);
    results.push(...current.results);
    last = current;
    cursor =
      current.has_more && current.next_cursor ? current.next_cursor : undefined;
  }

  return {
    ...last,
    has_more: false,
    next_cursor: null,
    results,
  } as T;
};
