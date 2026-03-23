import {
  extractResourceLocator,
  extractResourceMapper,
} from "@choiceopen/atomemo-plugin-sdk-js"
import {
  BASE_ID_URL_REGEX,
  RecordID_URL_REGEX,
  TABLE_URL_REGEX,
} from "./parameters"

const BASE_ID_REGEX = new RegExp(BASE_ID_URL_REGEX)
const TABLE_REGEX = new RegExp(TABLE_URL_REGEX)
const RECORD_ID_REGEX = new RegExp(RecordID_URL_REGEX)

function extractLocatorValue(value: unknown, urlRegex: RegExp): string {
  return extractResourceLocator(value, urlRegex)?.trim() ?? ""
}

export function resolveBaseId(parameters: Record<string, unknown>): string {
  return extractLocatorValue(parameters.base_id, BASE_ID_REGEX)
}

export function resolveTable(parameters: Record<string, unknown>): string {
  return extractLocatorValue(parameters.table, TABLE_REGEX)
}

export function resolveRecordId(parameters: Record<string, unknown>): string {
  return extractLocatorValue(parameters.record_id, RECORD_ID_REGEX)
}

function parseFieldsObject(raw: string): Record<string, unknown> {
  const parsed = JSON.parse(raw)
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed as Record<string, unknown>
  }

  return {}
}

export function resolveFields(
  parameters: Record<string, unknown>,
): Record<string, unknown> {
  const raw = parameters.fields

  const extracted = extractResourceMapper(raw)
  if (extracted == null) return {}
  if (typeof extracted === "object" && !Array.isArray(extracted)) {
    return extracted as Record<string, unknown>
  }
  if (typeof extracted === "string") return parseFieldsObject(extracted)

  if (raw == null || raw === "") return {}
  if (typeof raw === "object" && !Array.isArray(raw))
    return raw as Record<string, unknown>
  if (typeof raw === "string") return parseFieldsObject(raw)
  return {}
}
