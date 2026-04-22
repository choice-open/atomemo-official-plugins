// API docs: https://developers.hubspot.com/docs/api/crm/companies
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { createPropertyMappingMethod } from "../../_shared/methods"
import {
  credentialParams,
  idPropertyParam,
  objectIdParam,
  propertiesOptionalParam,
  upsertParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getBoolean,
  getHubSpotClient,
  getString,
  handleHubSpotError,
  resolveResourceMapper,
  toJsonValue,
} from "../../_shared/utils"

export const updateCompanyTool = {
  name: "hubspot-update-company",
  display_name: t("UPDATE_COMPANY_DISPLAY_NAME"),
  description: t("UPDATE_COMPANY_DESCRIPTION"),
  icon: "🏢",
  skill: "",
  parameters: [
    ...credentialParams,
    objectIdParam,
    propertiesOptionalParam,
    upsertParam,
    idPropertyParam,
  ],
  resource_mapping: createPropertyMappingMethod("companies"),
  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const properties =
      resolveResourceMapper(args.parameters, "properties") ?? {}
    const useUpsert = getBoolean(args.parameters, "upsert") ?? false
    try {
      if (useUpsert) {
        const idProperty = getString(args.parameters, "id_property") ?? "domain"
        const objectId = getString(args.parameters, "object_id")
        if (!idProperty || !objectId) {
          throw new Error(
            "Both object_id (as lookup value) and id_property are required for upsert mode",
          )
        }
        const response = await client.crm.companies.batchApi.upsert({
          inputs: [{ idProperty, id: objectId, properties }],
        })
        return toJsonValue({
          success: true,
          object: response.results[0],
          upserted: true,
        })
      }
      const objectId = getString(args.parameters, "object_id")
      if (!objectId) throw new Error("object_id is required")
      const result = await client.crm.companies.basicApi.update(objectId, {
        properties,
      })
      return toJsonValue({ success: true, object: result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
