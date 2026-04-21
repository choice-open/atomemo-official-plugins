// API docs: https://developers.hubspot.com/docs/api-reference/legacy/crm/using-object-apis
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import {
  credentialParams,
  filterGroupsParam,
  limitParam,
  objectTypeParam,
  returnPropertiesParam,
  searchQueryParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getNumber,
  getString,
  handleHubSpotError,
  resolveFilters,
} from "../../_shared/utils"

export const findCrmObjectTool = {
  name: "hubspot-find-crm-object",
  display_name: t("FIND_CRM_OBJECT_DISPLAY_NAME"),
  description: t("FIND_CRM_OBJECT_DESCRIPTION"),
  icon: "🔍",
  skill: "",
  parameters: [
    ...credentialParams,
    objectTypeParam,
    searchQueryParam,
    filterGroupsParam,
    limitParam,
    returnPropertiesParam,
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const objectType = getString(args.parameters, "object_type")
    if (!objectType) throw new Error("object_type is required")
    const query = getString(args.parameters, "search_query")
    const filterGroups = resolveFilters(args.parameters, "filter_groups")
    const limit = getNumber(args.parameters, "limit") ?? 100
    const returnProps = getString(args.parameters, "return_properties")
    const properties = returnProps
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      const result = await client.crm.objects.searchApi.doSearch(objectType, {
        query,
        filterGroups: filterGroups as any,
        properties,
        limit,
        after: undefined,
        sorts: undefined,
      })
      return {
        success: true,
        results: result.results,
        total: result.results.length,
        hasMore: !!result.paging?.next,
      } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
