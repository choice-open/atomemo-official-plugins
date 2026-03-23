import type { ToolResourceMappingField } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { type AirtableField, getBaseSchema } from "../../../api/client"
import { t } from "../../../i18n/i18n-node"
import { resolveBaseId, resolveTable } from "../resolve"
import { getAirtableToken } from "../utils"

function mapAirtableFieldType(fieldType: string): ToolResourceMappingField["type"] {
  switch (fieldType) {
    case "checkbox":
      return "boolean"
    case "count":
      return "integer"
    case "currency":
    case "number":
    case "percent":
    case "rating":
      return "number"
    case "lookup":
    case "multipleAttachments":
    case "multipleCollaborators":
    case "multipleLookupValues":
    case "multipleRecordLinks":
    case "multipleSelects":
      return "array"
    default:
      return "string"
  }
}

function mapSchemaField(field: AirtableField): ToolResourceMappingField {
  return {
    id: field.name,
    display_name: { en_US: field.name, zh_Hans: field.name },
    type: mapAirtableFieldType(field.type),
  }
}

export const mapTableFieldsMethod = {
  async map_table_fields({ args }: { args: { parameters: Record<string, unknown> } }) {
    const token = getAirtableToken(args)
    if (!token) throw new Error(t("ERROR_MISSING_CREDENTIAL").en_US)

    const baseId = resolveBaseId(args.parameters)
    if (!baseId) {
      return { fields: [], empty_fields_notice: t("PARAM_FIELDS_EMPTY_BASE_NOTICE") }
    }

    const table = resolveTable(args.parameters)
    if (!table) {
      return { fields: [], empty_fields_notice: t("PARAM_FIELDS_EMPTY_TABLE_NOTICE") }
    }

    const tables = await getBaseSchema(token, baseId)
    const matchedTable = tables.find((c) => c.id === table || c.name === table)

    return { fields: (matchedTable?.fields ?? []).map(mapSchemaField) }
  },
}
