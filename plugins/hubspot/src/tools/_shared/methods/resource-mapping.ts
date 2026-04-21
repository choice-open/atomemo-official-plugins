import type { ToolResourceMappingFunction } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { getHubSpotClient, getString, handleHubSpotError } from "../utils"

type MappingCtx = Parameters<ToolResourceMappingFunction>[0]

const READ_ONLY_PROPERTIES = new Set([
  "hs_object_id",
  "hs_createdate",
  "hs_lastmodifieddate",
  "createdate",
  "lastmodifieddate",
  "hs_object_source",
  "hs_object_source_id",
  "hs_object_source_label",
])

function mapHubSpotFieldType(
  type: string,
  fieldType: string,
): "string" | "number" | "boolean" {
  if (type === "number") return "number"
  if (type === "bool" || fieldType === "booleancheckbox") return "boolean"
  return "string"
}

export function createPropertyMappingMethod(objectType: string) {
  return {
    async map_object_properties({ args }: MappingCtx) {
      const client = getHubSpotClient(args)
      const resolvedType =
        getString(args.parameters, "object_type") ?? objectType

      if (!resolvedType) {
        return {
          fields: [],
          empty_fields_notice: t("PARAM_PROPERTIES_EMPTY_NOTICE"),
        }
      }

      try {
        const response =
          await client.crm.properties.coreApi.getAll(resolvedType)

        const fields = response.results
          .filter(
            (prop) =>
              !READ_ONLY_PROPERTIES.has(prop.name) &&
              !prop.calculated &&
              !prop.modificationMetadata?.readOnlyValue &&
              !prop.hidden,
          )
          .map((prop) => ({
            id: prop.name,
            display_name: { en_US: prop.label, zh_Hans: prop.label },
            type: mapHubSpotFieldType(prop.type, prop.fieldType) as
              | "string"
              | "number"
              | "boolean",
            required: false,
            ui: {
              hint: prop.description
                ? { en_US: prop.description, zh_Hans: prop.description }
                : undefined,
            },
          }))

        return { fields }
      } catch (error) {
        handleHubSpotError(error)
      }
    },
  }
}
