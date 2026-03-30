import type {
  ToolResourceMappingField,
  ToolResourceMappingFunction,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { type AirtableField, getBaseSchema } from "../../../api/client"
import { t } from "../../../i18n/i18n-node"
import { mapAirtableFieldType } from "../field-types"
import { resolveBaseId, resolveTable } from "../resolve"
import { getAirtableToken } from "../utils"

type MappingCtx = Parameters<ToolResourceMappingFunction>[0]
type LocalizedText = { en_US: string; zh_Hans: string }

const NON_INSERTABLE_FIELD_TYPES = new Set([
  "aiText",
  "autoNumber",
  "button",
  "count",
  "createdBy",
  "createdTime",
  "formula",
  "lastModifiedBy",
  "lastModifiedTime",
  "lookup",
  "multipleLookupValues",
  "rollup",
])

const localized = (en_US: string, zh_Hans: string): LocalizedText => ({
  en_US,
  zh_Hans,
})

const DEFAULT_FIELD_HINTS: Record<
  ToolResourceMappingField["type"],
  LocalizedText
> = {
  string: localized(
    'String cell value. Example: "Example text".',
    '字符串类型的单元格值。例如："示例文本"。',
  ),
  number: localized(
    "Number cell value. Example: 123.45.",
    "数字类型的单元格值。例如：123.45。",
  ),
  integer: localized(
    "Integer cell value. Example: 1.",
    "整数类型的单元格值。例如：1。",
  ),
  boolean: localized(
    "Boolean cell value. Example: true or false.",
    "布尔类型的单元格值。例如：true 或 false。",
  ),
  object: localized(
    "Object cell value in Airtable API format.",
    "使用 Airtable API 格式的对象类型单元格值。",
  ),
  array: localized(
    "Array cell value in Airtable API format.",
    "使用 Airtable API 格式的数组类型单元格值。",
  ),
}

const FIELD_VALUE_HINTS: Record<string, LocalizedText> = {
  barcode: localized(
    'Accepts a barcode text string or an object with `text` and optional `type`; a plain string is normalized to a barcode object. Example: "123456789012" or { "text": "123456789012", "type": "code128" }.',
    '接受条码文本字符串，或包含 `text` 和可选 `type` 的对象；纯字符串会被规范化为条码对象。例如："123456789012" 或 { "text": "123456789012", "type": "code128" }。',
  ),
  checkbox: localized(
    'Accepts booleans, `1`/`0`, or common strings like `"true"`/`"false"` and `"yes"`/`"no"`; `null` becomes `false`. Example: true.',
    '接受布尔值、`1`/`0`，或常见字符串如 `"true"`/`"false"`、`"yes"`/`"no"`；`null` 会变成 `false`。例如：true。',
  ),
  currency: localized(
    'Accepts a number or numeric string; values are normalized to a number. Example: 123.45 or "123.45".',
    '接受数字或数字字符串；值会被规范化为数字。例如：123.45 或 "123.45"。',
  ),
  date: localized(
    'ISO 8601 date string. Example: "2024-01-31".',
    'ISO 8601 日期字符串。例如："2024-01-31"。',
  ),
  dateTime: localized(
    'ISO 8601 datetime string. Example: "2024-01-31T12:34:56.000Z".',
    'ISO 8601 日期时间字符串。例如："2024-01-31T12:34:56.000Z"。',
  ),
  duration: localized(
    'Accepts seconds as a number or numeric string; values are normalized to a number. Example: 3600 or "3600".',
    '接受以秒为单位的数字或数字字符串；值会被规范化为数字。例如：3600 或 "3600"。',
  ),
  email: localized(
    'Email string. Example: "name@example.com".',
    '邮箱字符串。例如："name@example.com"。',
  ),
  multilineText: localized(
    'String cell value. Example: "Line 1\\nLine 2".',
    '字符串类型的单元格值。例如："第 1 行\\n第 2 行"。',
  ),
  multipleAttachments: localized(
    'Accepts a URL string, a `{ url }` object, or an array of them; single values are normalized to an attachment array. Example: "https://example.com/file.png" or [{ "url": "https://example.com/file.png" }].',
    '接受 URL 字符串、`{ url }` 对象，或它们组成的数组；单个值会被规范化为附件数组。例如："https://example.com/file.png" 或 [{ "url": "https://example.com/file.png" }]。',
  ),
  multipleCollaborators: localized(
    'Accepts an email, user ID, collaborator object, or an array of them; values are normalized to an array of collaborator objects. Prefer user IDs for writes: even a valid email can still error if Airtable cannot resolve it as a collaborator. Example: "name@example.com" or [{ "id": "usrXXXXXXXXXXXXXX" }].',
    '接受邮箱、用户 ID、协作者对象，或它们组成的数组；值会被规范化为协作者对象数组。写入时更建议使用用户 ID：即使邮箱格式正确，如果 Airtable 无法将其解析为协作者，仍然可能报错。例如："name@example.com" 或 [{ "id": "usrXXXXXXXXXXXXXX" }]。',
  ),
  multipleRecordLinks: localized(
    'Accepts a record ID string, an `{ id }` object, or an array of them; values are normalized to an array of record IDs. Example: "recXXXXXXXXXXXXXX" or ["recXXXXXXXXXXXXXX"].',
    '接受记录 ID 字符串、`{ id }` 对象，或它们组成的数组；值会被规范化为记录 ID 数组。例如："recXXXXXXXXXXXXXX" 或 ["recXXXXXXXXXXXXXX"]。',
  ),
  multipleSelects: localized(
    'Accepts an option name string, a `{ name }` object, or an array of them; values are normalized to an array of option names. Empty string becomes `[]`. Example: "Urgent" or ["Urgent", "Bug"].',
    '接受选项名称字符串、`{ name }` 对象，或它们组成的数组；值会被规范化为选项名称数组。空字符串会变成 `[]`。例如："Urgent" 或 ["Urgent", "Bug"]。',
  ),
  number: localized(
    'Accepts a number or numeric string; values are normalized to a number. Example: 123.45 or "123.45".',
    '接受数字或数字字符串；值会被规范化为数字。例如：123.45 或 "123.45"。',
  ),
  percent: localized(
    'Accepts a number or numeric string; values are normalized to a number. Example: 19.5 or "19.5".',
    '接受数字或数字字符串；值会被规范化为数字。例如：19.5 或 "19.5"。',
  ),
  phoneNumber: localized(
    'Phone number string. Example: "+1 555 123 4567".',
    '电话号码字符串。例如："+1 555 123 4567"。',
  ),
  rating: localized(
    'Accepts a number or numeric string; values are normalized to a number. Example: 4 or "4".',
    '接受数字或数字字符串；值会被规范化为数字。例如：4 或 "4"。',
  ),
  richText: localized(
    'Rich text string. Example: "Some **bold** text".',
    '富文本字符串。例如："Some **bold** text"。',
  ),
  singleCollaborator: localized(
    'Accepts an email string, user ID string, or a collaborator object with `id` or `email`; string values are normalized to a collaborator object. Prefer user IDs for writes: even a valid email can still error if Airtable cannot resolve it as a collaborator. Example: "name@example.com" or { "id": "usrXXXXXXXXXXXXXX" }.',
    '接受邮箱字符串、用户 ID 字符串，或包含 `id` / `email` 的协作者对象；字符串值会被规范化为协作者对象。写入时更建议使用用户 ID：即使邮箱格式正确，如果 Airtable 无法将其解析为协作者，仍然可能报错。例如："name@example.com" 或 { "id": "usrXXXXXXXXXXXXXX" }。',
  ),
  singleLineText: localized(
    'String cell value. Example: "Example text".',
    '字符串类型的单元格值。例如："示例文本"。',
  ),
  singleSelect: localized(
    'Accepts an option name string or a `{ name }` object; values are normalized to the option name string. Empty string becomes `null`. Example: "In Progress".',
    '接受选项名称字符串或 `{ name }` 对象；值会被规范化为选项名称字符串。空字符串会变成 `null`。例如："In Progress"。',
  ),
  url: localized(
    'URL string. Example: "https://example.com".',
    'URL 字符串。例如："https://example.com"。',
  ),
}

function isNonInsertableField(field: AirtableField): boolean {
  if (NON_INSERTABLE_FIELD_TYPES.has(field.type)) return true

  if (typeof field.options === "object" && field.options !== null) {
    const maybeComputed = (field.options as { isComputed?: unknown }).isComputed
    if (maybeComputed === true) return true
  }

  return false
}

function mapSchemaFieldHint(fieldType: string): LocalizedText {
  return (
    FIELD_VALUE_HINTS[fieldType] ??
    DEFAULT_FIELD_HINTS[mapAirtableFieldType(fieldType)]
  )
}

function mapSchemaField(field: AirtableField): ToolResourceMappingField {
  return {
    id: field.name,
    display_name: { en_US: field.name, zh_Hans: field.name },
    type: mapAirtableFieldType(field.type),
    ui: {
      hint: mapSchemaFieldHint(field.type),
    },
  }
}

export const mapTableFieldsMethod = {
  async map_table_fields({ args }: MappingCtx) {
    const token = getAirtableToken(args)
    if (!token) throw new Error(t("ERROR_MISSING_CREDENTIAL").en_US)

    const baseId = resolveBaseId(args.parameters)
    if (!baseId) {
      return {
        fields: [],
        empty_fields_notice: t("PARAM_FIELDS_EMPTY_BASE_NOTICE"),
      }
    }

    const table = resolveTable(args.parameters)
    if (!table) {
      return {
        fields: [],
        empty_fields_notice: t("PARAM_FIELDS_EMPTY_TABLE_NOTICE"),
      }
    }

    const tables = await getBaseSchema(token, baseId)
    const matchedTable = tables.find((c) => c.id === table || c.name === table)

    return {
      fields: (matchedTable?.fields ?? [])
        .filter((f) => !isNonInsertableField(f))
        .map(mapSchemaField),
    }
  },
}
