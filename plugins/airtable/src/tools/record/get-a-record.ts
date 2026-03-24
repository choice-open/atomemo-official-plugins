import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getRecord } from "../../api/client"
import { t } from "../../i18n/i18n-node"
import {
  searchBasesMethod,
  searchRecordsMethod,
  searchTablesMethod,
} from "../_shared/methods"
import { recordTargetParams } from "../_shared/parameters"
import {
  resolveBaseId,
  resolveRecordId,
  resolveTable,
} from "../_shared/resolve"
import { getAirtableToken } from "../_shared/utils"

export const getARecordTool = {
  name: "airtable-get-record",
  display_name: t("GET_RECORD_DISPLAY_NAME"),
  description: t("GET_RECORD_DESCRIPTION"),
  icon: "🔍",

  parameters: [...recordTargetParams],
  locator_list: {
    ...searchBasesMethod,
    ...searchTablesMethod,
    ...searchRecordsMethod,
  },
  async invoke({ args }) {
    const token = getAirtableToken(args)
    if (!token) {
      throw new Error(
        "Missing Airtable credential. Please select a valid Airtable credential.",
      )
    }

    const p = (args as { parameters: Record<string, unknown> }).parameters
    const baseId = resolveBaseId(p)
    const table = resolveTable(p)
    const recordId = resolveRecordId(p)

    if (!baseId) throw new Error("base_id is required.")
    if (!table) throw new Error("table is required.")
    if (!recordId) throw new Error("record_id is required.")

    const record = await getRecord(token, baseId, table, recordId)
    return { success: true, record } as any
  },
} satisfies ToolDefinition
