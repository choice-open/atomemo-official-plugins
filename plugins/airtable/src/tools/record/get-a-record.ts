import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getRecord } from "../../api/client"
import { t } from "../../i18n/i18n-node"
import { getAirtableToken } from "../_shared/utils"
import { baseIdParam, credentialParam, recordIdParam, tableParam } from "../_shared/parameters"

export const getARecordTool = {
  name: "airtable-get-record",
  display_name: t("GET_RECORD_DISPLAY_NAME"),
  description: t("GET_RECORD_DESCRIPTION"),
  icon: "🔍",
  parameters: [
    credentialParam,
    baseIdParam,
    tableParam,
    recordIdParam,
  ],
  async invoke({ args }) {
    const token = getAirtableToken(args)
    if (!token) {
      throw new Error(
        "Missing Airtable credential. Please select a valid Airtable credential.",
      )
    }

    const p = (args as { parameters: Record<string, unknown> }).parameters
    const baseId = String(p["base_id"] ?? "").trim()
    const table = String(p["table"] ?? "").trim()
    const recordId = String(p["record_id"] ?? "").trim()

    if (!baseId) throw new Error("base_id is required.")
    if (!table) throw new Error("table is required.")
    if (!recordId) throw new Error("record_id is required.")

    const record = await getRecord(token, baseId, table, recordId)
    return { success: true, record } as any
  },
} satisfies ToolDefinition
