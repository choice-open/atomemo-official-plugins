// API docs: https://developers.hubspot.com/docs/api/crm/line-items
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import {
  credentialParams,
  filterGroupsParam,
  limitParam,
  returnPropertiesParam,
  searchQueryParam,
} from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getNumber,
  getString,
  getStringArray,
  handleHubSpotError,
  resolveFilters,
  toJsonValue,
} from "../../_shared/utils"

export const findLineItemTool = {
  name: "hubspot-find-line-item",
  display_name: t("FIND_LINE_ITEM_DISPLAY_NAME"),
  description: t("FIND_LINE_ITEM_DESCRIPTION"),
  icon: "🔍",
  skill: "",
  parameters: [
    ...credentialParams,
    searchQueryParam,
    filterGroupsParam,
    limitParam,
    returnPropertiesParam,
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const query = getString(args.parameters, "search_query")
    const filterGroups = resolveFilters(args.parameters, "filter_groups")
    const limit = getNumber(args.parameters, "limit") ?? 100
    const properties = getStringArray(args.parameters, "return_properties")

    try {
      const result = await client.crm.lineItems.searchApi.doSearch({
        query,
        filterGroups: filterGroups as any,
        properties,
        limit,
        after: undefined,
        sorts: undefined,
      })
      return toJsonValue({
        success: true,
        results: result.results,
        total: result.results.length,
        hasMore: !!result.paging?.next,
      })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
