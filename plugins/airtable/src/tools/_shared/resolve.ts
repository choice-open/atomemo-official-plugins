import {
  extractResourceLocator,
  extractResourceMapper,
} from "@choiceopen/atomemo-plugin-sdk-js"
import type { ToolResourceMappingField } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { AirtableField } from "../../api/client"
import { getBaseSchema } from "../../api/client"
import { mapAirtableFieldType } from "./field-types"
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isResourceMapperValue(value: unknown): boolean {
  return isRecord(value) && value.__type__ === "resource_mapper"
}

function resolveRawFields(
  parameters: Record<string, unknown>,
): Record<string, unknown> {
  const raw = parameters.fields
  if (raw == null || raw === "") return {}
  if (isRecord(raw)) {
    if (!isResourceMapperValue(raw)) return raw

    const extracted = extractResourceMapper(raw)
    if (extracted == null) return {}
    if (isRecord(extracted)) return extracted
    if (typeof extracted === "string") return parseFieldsObject(extracted)
    return {}
  }

  if (typeof raw === "string") {
    const parsed = parseFieldsObject(raw)
    if (isResourceMapperValue(parsed)) {
      const extracted = extractResourceMapper(parsed)
      if (extracted == null) return {}
      if (isRecord(extracted)) return extracted
      if (typeof extracted === "string") return parseFieldsObject(extracted)
      return {}
    }

    return parsed
  }

  return {}
}

function trimString(value: string): string {
  return value.trim()
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = trimString(value)
  return trimmed.length > 0 ? trimmed : null
}

function parseJsonString(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

function normalizeRecordLinkItem(value: unknown): unknown {
  const stringValue = asNonEmptyString(value)
  if (stringValue) return stringValue

  if (!isRecord(value)) return value

  const id = asNonEmptyString(value.id)
  if (id) return id

  return value
}

function normalizeMultiValue<T>(
  value: unknown,
  normalizeItem: (item: unknown) => T,
): T[] {
  if (Array.isArray(value)) return value.map(normalizeItem)
  return [normalizeItem(value)]
}

function normalizeRecordLinkValue(value: unknown): unknown {
  return normalizeMultiValue(value, normalizeRecordLinkItem)
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
  return normalizeMultiValue(value, normalizeCollaboratorItem)
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
  return normalizeMultiValue(value, normalizeAttachmentItem)
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

function normalizeIntegerValue(value: unknown): unknown {
  if (typeof value === "number") return value
  if (typeof value === "bigint") {
    const numericValue = Number(value)
    return Number.isSafeInteger(numericValue) ? numericValue : value
  }

  const normalizedValue = normalizeNumericValue(value)
  return typeof normalizedValue === "number" &&
    Number.isInteger(normalizedValue)
    ? normalizedValue
    : value
}

function normalizeBooleanValue(value: unknown): unknown {
  if (value === undefined) return undefined
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

function normalizeCheckboxValue(value: unknown): unknown {
  if (value === null) return false
  return normalizeBooleanValue(value)
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

  return normalizeMultiValue(value, normalizeSelectItem)
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

function normalizeArrayValue(value: unknown): unknown {
  if (Array.isArray(value)) return value

  const stringValue = asNonEmptyString(value)
  if (!stringValue) return value

  const parsed = parseJsonString(stringValue)
  return Array.isArray(parsed) ? parsed : value
}

function normalizeObjectValue(value: unknown): unknown {
  if (isRecord(value)) return value

  const stringValue = asNonEmptyString(value)
  if (!stringValue) return value

  const parsed = parseJsonString(stringValue)
  return isRecord(parsed) ? parsed : value
}

export function normalizeMappedFieldValue(
  mappingType: ToolResourceMappingField["type"],
  value: unknown,
): unknown {
  switch (mappingType) {
    case "number":
      return normalizeNumericValue(value)
    case "integer":
      return normalizeIntegerValue(value)
    case "boolean":
      return normalizeBooleanValue(value)
    case "array":
      return normalizeArrayValue(value)
    case "object":
      return normalizeObjectValue(value)
    default:
      return value
  }
}

function normalizeAirtableFieldValue(
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

function removeNullValuedKeys(
  fields: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== null),
  )
}

export async function resolveFields(
  parameters: Record<string, unknown>,
  token: string,
  baseId: string,
  table: string,
): Promise<Record<string, unknown>> {
  const resolvedFields = removeNullValuedKeys(resolveRawFields(parameters))
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
        const mappingType = mapAirtableFieldType(field.type)
        const mappedValue = normalizeMappedFieldValue(mappingType, value)
        return [
          key,
          normalizeAirtableFieldValue(field.type, mappedValue),
        ] as const
      },
    )

    return removeNullValuedKeys(Object.fromEntries(normalizedEntries))
  } catch {
    return resolvedFields
  }
}
