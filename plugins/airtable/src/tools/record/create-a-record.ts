import type {
  ToolResourceMappingField,
  PropertyResourceLocator,
  PropertyResourceMapper,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  type AirtableField,
  createRecord,
  getBaseSchema,
  listBases,
} from "../../api/client"
import { t } from "../../i18n/i18n-node"
import { credentialParam, typecastParam } from "../_shared/parameters"
import { getAirtableToken, parseFieldsJson } from "../_shared/utils"


const baseIdParam = {
  name: "base_id",
  type: "resource_locator",
  required: true,
  display_name: t("PARAM_BASE_ID_LABEL"),
  ai: {
    llm_description: t("PARAM_BASE_ID_HINT"),
  },
  modes: [
    {
      type: "list",
      display_name: t("PARAM_BASE_ID_MODE_LIST_LABEL"),
      search_list_method: "search_bases",
      searchable: true,
    },
    {
      type: "id",
      display_name: t("PARAM_BASE_ID_MODE_ID_LABEL"),
    },
  ],
} satisfies PropertyResourceLocator<"base_id">

const tableParam = {
  name: "table",
  type: "resource_locator",
  required: true,
  display_name: t("PARAM_TABLE_LABEL"),
  depends_on: ["base_id"],
  ai: {
    llm_description: t("PARAM_TABLE_HINT"),
  },
  modes: [
    {
      type: "list",
      display_name: t("PARAM_TABLE_MODE_LIST_LABEL"),
      search_list_method: "search_tables",
      searchable: true,
    },
    {
      type: "id",
      display_name: t("PARAM_TABLE_MODE_ID_LABEL"),
    },
  ],
} satisfies PropertyResourceLocator<"table">

const fieldsParam = {
  name: "fields",
  type: "resource_mapper",
  required: true,
  display_name: t("PARAM_FIELDS_LABEL"),
  depends_on: ["base_id", "table"],
  ai: {
    llm_description: t("PARAM_FIELDS_HINT"),
  },
  mapping_method: "map_table_fields",
} satisfies PropertyResourceMapper<"fields">

function getParameterString(parameters: Record<string, unknown>, name: string) {
  return typeof parameters[name] === "string" ? parameters[name].trim() : ""
}

function matchesFilter(
  values: Array<string | undefined>,
  filter?: string | null,
): boolean {
  const normalizedFilter = filter?.trim().toLowerCase()
  if (!normalizedFilter) return true

  return values.some((value) => value?.toLowerCase().includes(normalizedFilter))
}

function getCredentialError() {
  return new Error(t("ERROR_MISSING_CREDENTIAL").en_US)
}

function mapAirtableFieldType(
  fieldType: string,
): ToolResourceMappingField["type"] {
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

export const createRecordTool = {
  name: "airtable-create-record",
  display_name: t("CREATE_RECORD_DISPLAY_NAME"),
  description: t("CREATE_RECORD_DESCRIPTION"),
  icon: "➕",
  parameters: [
    credentialParam,
    baseIdParam,
    // tableParam,
    // fieldsParam,
    // typecastParam,
  ],
  locator_list: {
    async search_bases({ credentials, filter, parameters }) {
      const token = getAirtableToken({ credentials, parameters })
      if (!token) {
        throw getCredentialError()
      }

      const bases = await listBases(token, { returnAll: true })
      const results = bases
        .filter((base) => matchesFilter([base.name, base.id], filter))
        .map((base) => ({
          label: base.name,
          value: base.id,
          url: `https://airtable.com/${base.id}`,
        }))

      return { results }
    },
    async search_tables({ credentials, filter, parameters }) {
      const token = getAirtableToken({ credentials, parameters })
      if (!token) {
        throw getCredentialError()
      }

      const baseId = getParameterString(parameters, "base_id")
      if (!baseId) {
        return { results: [] }
      }

      const tables = await getBaseSchema(token, baseId)
      const results = tables
        .filter((table) => matchesFilter([table.name, table.id], filter))
        .map((table) => ({
          label: table.name,
          value: table.name,
          url: `https://airtable.com/${baseId}/${table.id}`,
        }))

      return { results }
    },
  },
  resource_mapping: {
    async map_table_fields({ args }) {
      const token = getAirtableToken(args)
      if (!token) {
        throw getCredentialError()
      }

      const baseId = getParameterString(args.parameters, "base_id")
      if (!baseId) {
        return {
          fields: [],
          empty_fields_notice: t("PARAM_FIELDS_EMPTY_BASE_NOTICE"),
        }
      }

      const table = getParameterString(args.parameters, "table")
      if (!table) {
        return {
          fields: [],
          empty_fields_notice: t("PARAM_FIELDS_EMPTY_TABLE_NOTICE"),
        }
      }

      const tables = await getBaseSchema(token, baseId)
      const matchedTable = tables.find(
        (candidate) => candidate.id === table || candidate.name === table,
      )

      return {
        fields: (matchedTable?.fields ?? []).map(mapSchemaField),
      }
    },
  },
  async invoke({ args }) {
    const token = getAirtableToken(args)
    if (!token) {
      throw getCredentialError()
    }

    const p = (args as { parameters: Record<string, unknown> }).parameters
    const baseId = getParameterString(p, "base_id")
    const table = getParameterString(p, "table")
    const fields = parseFieldsJson(p.fields)
    const typecast = p.typecast === true

    if (!baseId) throw new Error(t("ERROR_BASE_ID_REQUIRED").en_US)
    if (!table) throw new Error(t("ERROR_TABLE_REQUIRED").en_US)

    const record = await createRecord(token, baseId, table, fields, typecast)
    return { success: true, record }
  },
} satisfies ToolDefinition


