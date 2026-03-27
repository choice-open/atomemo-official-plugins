import {
  extractResourceLocator,
  extractResourceMapper,
} from "@choiceopen/atomemo-plugin-sdk-js"
import type { AirtableField } from "../../api/client"
import { getBaseSchema } from "../../api/client"
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
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
  } catch {
    return {}
  }

  return {}
}

function resolveRawFields(
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

function trimString(value: string): string {
  return value.trim()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = trimString(value)
  return trimmed.length > 0 ? trimmed : null
}

function normalizeRecordLinkItem(value: unknown): unknown {
  const stringValue = asNonEmptyString(value)
  if (stringValue) return stringValue

  if (!isRecord(value)) return value

  const id = asNonEmptyString(value.id)
  if (id) return id

  return value
}

function normalizeRecordLinkValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeRecordLinkItem)

  const normalized = normalizeRecordLinkItem(value)
  return normalized === value ? value : [normalized]
}

function normalizeCollaboratorItem(value: unknown): unknown {
  const stringValue = asNonEmptyString(value)
  if (stringValue) {
    return stringValue.includes("@")
      ? { email: stringValue }
      : { id: stringValue }
  }

  if (!isRecord(value)) return value

  const id = asNonEmptyString(value.id)
  if (id) return { ...value, id }

  const email = asNonEmptyString(value.email)
  if (email) return { ...value, email }

  return value
}

function normalizeSingleCollaboratorValue(value: unknown): unknown {
  return normalizeCollaboratorItem(value)
}

function normalizeMultipleCollaboratorsValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeCollaboratorItem)

  const normalized = normalizeCollaboratorItem(value)
  return normalized === value ? value : [normalized]
}

function normalizeAttachmentItem(value: unknown): unknown {
  const stringValue = asNonEmptyString(value)
  if (stringValue) return { url: stringValue }

  if (!isRecord(value)) return value

  const url = asNonEmptyString(value.url)
  if (url) return { ...value, url }

  return value
}

function normalizeMultipleAttachments(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeAttachmentItem)

  const normalized = normalizeAttachmentItem(value)
  return normalized === value ? value : [normalized]
}

function normalizeBarcodeValue(value: unknown): unknown {
  const stringValue = asNonEmptyString(value)
  if (stringValue) return { text: stringValue }

  if (!isRecord(value)) return value

  const text = asNonEmptyString(value.text)
  const type = asNonEmptyString(value.type)
  if (!text && !type) return value

  return {
    ...value,
    ...(text ? { text } : {}),
    ...(type ? { type } : {}),
  }
}

function normalizeNumericValue(value: unknown): unknown {
  if (typeof value === "number") return value
  if (typeof value === "bigint") return Number(value)

  const stringValue = asNonEmptyString(value)
  if (!stringValue) return value

  const numericValue = Number(stringValue)
  return Number.isFinite(numericValue) ? numericValue : value
}

function normalizeCheckboxValue(value: unknown): unknown {
  if(value === null) return false
  if(value === undefined) return undefined
  if (typeof value === "boolean") return value
  if (typeof value === "number") {
    if (value === 1) return true
    if (value === 0) return false
    return value
  }

  const stringValue = asNonEmptyString(value)?.toLowerCase()
  switch (stringValue) {
    case "true":
    case "1":
    case "yes":
    case "on":
      return true
    case "false":
    case "0":
    case "no":
    case "off":
      return false
    default:
      return value
  }
}

function normalizeSelectItem(value: unknown): unknown {
  const stringValue = asNonEmptyString(value)
  if (stringValue) return stringValue

  if (!isRecord(value)) return value

  const name = asNonEmptyString(value.name)
  if (name) return name

  return value
}

function isEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() === ""
}

function normalizeSingleSelectValue(value: unknown): unknown {
  if (isEmptyString(value)) return null
  return normalizeSelectItem(value)
}

function normalizeMultipleSelectValue(value: unknown): unknown {
  if (isEmptyString(value)) return []
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return normalizeMultipleSelectValue(parsed)
    } catch {
      // not JSON — fall through to treat as a single option name
    }
  }
  if (Array.isArray(value)) {
    return value.filter((item) => !isEmptyString(item)).map(normalizeSelectItem)
  }

  const normalized = normalizeSelectItem(value)
  return normalized === value ? value : [normalized]
}

function normalizeDateValue(value: unknown): unknown {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10)
  }

  return value
}

function normalizeDateTimeValue(value: unknown): unknown {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString()
  }

  return value
}

export function normalizeFieldValue(
  fieldType: string,
  value: unknown,
): unknown {
  switch (fieldType) {
    case "multipleRecordLinks":
      return normalizeRecordLinkValue(value)
    case "singleCollaborator":
      return normalizeSingleCollaboratorValue(value)
    case "multipleCollaborators":
      return normalizeMultipleCollaboratorsValue(value)
    case "multipleSelects":
      return normalizeMultipleSelectValue(value)
    case "singleSelect":
      return normalizeSingleSelectValue(value)
    case "multipleAttachments":
      return normalizeMultipleAttachments(value)
    case "barcode":
      return normalizeBarcodeValue(value)
    case "checkbox":
      return normalizeCheckboxValue(value)
    case "number":
    case "currency":
    case "percent":
    case "rating":
    case "duration":
    case "count":
    case "autoNumber":
      return normalizeNumericValue(value)
    case "date":
      return normalizeDateValue(value)
    case "dateTime":
    case "createdTime":
    case "lastModifiedTime":
      return normalizeDateTimeValue(value)
    default:
      return value
  }
}

function buildFieldMap(fields: AirtableField[]): Map<string, AirtableField> {
  const map = new Map<string, AirtableField>()
  for (const field of fields) {
    map.set(field.name, field)
  }
  return map
}

export async function resolveFields(
  parameters: Record<string, unknown>,
  token: string,
  baseId: string,
  table: string,
): Promise<Record<string, unknown>> {
  const resolvedFields = resolveRawFields(parameters)
  if (Object.keys(resolvedFields).length === 0) return resolvedFields

  try {
    const tables = await getBaseSchema(token, baseId)
    const matchedTable = tables.find((c) => c.id === table || c.name === table)
    if (!matchedTable) return resolvedFields

    const fieldMap = buildFieldMap(matchedTable.fields)
    const normalizedEntries = Object.entries(resolvedFields).map(
      ([key, value]) => {
        const field = fieldMap.get(key)
        if (!field) return [key, value] as const
        return [key, normalizeFieldValue(field.type, value)] as const
      },
    )

    return Object.fromEntries(normalizedEntries)
  } catch {
    return resolvedFields
  }
}
