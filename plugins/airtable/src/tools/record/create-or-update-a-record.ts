import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { updateRecord } from "../../api/client"
import { t } from "../../i18n/i18n-node"
import { getAirtableToken, parseFieldsJson } from "../_shared/utils"
import {
  baseIdParam,
  credentialParam,
  fieldsParam,
  recordIdParam,
  tableParam,
  typecastParam,
} from "../_shared/parameters"

export const upsertRecordTool = {
  name: "airtable-upsert-record",
  display_name: t("UPSERT_RECORD_DISPLAY_NAME"),
  description: t("UPSERT_RECORD_DESCRIPTION"),
  icon: "🔁",
  parameters: [
    credentialParam,
    baseIdParam,
    tableParam,
    recordIdParam,
    fieldsParam,
    typecastParam,
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
    const fields = parseFieldsJson(p["fields"])
    const typecast = p["typecast"] === true

    if (!baseId) throw new Error("base_id is required.")
    if (!table) throw new Error("table is required.")
    if (!recordId) throw new Error("record_id is required.")

    const record = await updateRecord(token, baseId, table, recordId, fields, typecast)

    return { success: true, record } as any
  },
} satisfies ToolDefinition

