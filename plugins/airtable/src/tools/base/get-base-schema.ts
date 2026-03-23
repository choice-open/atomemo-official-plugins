import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getBaseSchema } from "../../api/client"
import { t } from "../../i18n/i18n-node"
import { searchBasesMethod } from "../_shared/methods"
import { baseIdParamRL, credentialParam } from "../_shared/parameters"
import { resolveBaseId } from "../_shared/resolve"
import { getAirtableToken } from "../_shared/utils"

export const getBaseSchemaTool = {
  name: "airtable-get-base-schema",
  display_name: t("GET_BASE_SCHEMA_DISPLAY_NAME"),
  description: t("GET_BASE_SCHEMA_DESCRIPTION"),
  icon: "📋",

  parameters: [credentialParam, baseIdParamRL],
  locator_list: { ...searchBasesMethod },
  async invoke({ args }) {
    const token = getAirtableToken(args)
    if (!token) {
      throw new Error(
        "Missing Airtable credential. Please select a valid Airtable credential.",
      )
    }

    const p = (args as { parameters: Record<string, unknown> }).parameters
    const baseId = resolveBaseId(p)

    if (!baseId) throw new Error("base_id is required.")

    const tables = await getBaseSchema(token, baseId)
    return { success: true, tables, total: tables.length } as any
  },
} satisfies ToolDefinition
