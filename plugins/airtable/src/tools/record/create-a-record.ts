import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createRecord } from "../../api/client"
import { t } from "../../i18n/i18n-node"
import { getAirtableToken, parseFieldsJson } from "../_shared/utils"
import {
  baseIdParam,
  credentialParam,
  fieldsParam,
  tableParam,
  typecastParam,
} from "../_shared/parameters"

export const createRecordTool = {
  name: "airtable-create-record",
  display_name: t("CREATE_RECORD_DISPLAY_NAME"),
  description: t("CREATE_RECORD_DESCRIPTION"),
  icon: "➕",
  parameters: [
    credentialParam,
    baseIdParam,
    tableParam,
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
    const fields = parseFieldsJson(p["fields"])
    const typecast = p["typecast"] === true

    if (!baseId) throw new Error("base_id is required.")
    if (!table) throw new Error("table is required.")

    const record = await createRecord(token, baseId, table, fields, typecast)
    return { success: true, record } as any
  },
} satisfies ToolDefinition
