import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { listBases } from "../../api/client"
import { t } from "../../i18n/i18n-node"
import {
  credentialParam,
  listLimitParam,
  RETURN_ALL_PARAM_NAME,
  returnAllParam,
} from "../_shared/parameters"
import { getAirtableToken } from "../_shared/utils"

export const getManyBasesTool = {
  name: "airtable-list-bases",
  display_name: t("LIST_BASES_DISPLAY_NAME"),
  description: t("LIST_BASES_DESCRIPTION"),
  icon: "🗂️",

  parameters: [
    credentialParam,
    returnAllParam,
    listLimitParam,
    {
      name: "permission_level",
      type: "array",
      required: false,
      display_name: t("LIST_BASES_PERMISSION_LEVEL_LABEL"),
      ai: {
        llm_description: t("LIST_BASES_PERMISSION_LEVEL_HINT"),
      },
      ui: {
        component: "multi-select",
        hint: t("LIST_BASES_PERMISSION_LEVEL_HINT"),
        options: [
          { label: t("LIST_BASES_PERMISSION_NONE"), value: "none" },
          { label: t("LIST_BASES_PERMISSION_READ"), value: "read" },
          { label: t("LIST_BASES_PERMISSION_COMMENT"), value: "comment" },
          { label: t("LIST_BASES_PERMISSION_CREATE"), value: "create" },
          { label: t("LIST_BASES_PERMISSION_EDIT"), value: "edit" },
        ],
        support_expression: true,
      },
      items: {
        name: "permission",
        type: "string",
        enum: ["none", "read", "comment", "create", "edit"],
      },
    },
  ],
  async invoke({ args }) {
    const token = getAirtableToken(args)
    if (!token) {
      throw new Error(
        "Missing Airtable credential. Please select a valid Airtable credential.",
      )
    }

    const p = (args as { parameters: Record<string, unknown> }).parameters
    const returnAll = p[RETURN_ALL_PARAM_NAME] !== false
    const limit = typeof p.limit === "number" ? p.limit : 100
    const permissionLevel = Array.isArray(p.permission_level)
      ? (p.permission_level as string[])
      : []

    const bases = await listBases(token, { returnAll, limit, permissionLevel })
    return { success: true, bases, total: bases.length } as any
  },
} satisfies ToolDefinition
