import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { updateRecord } from "../../api/client"
import { t } from "../../i18n/i18n-node"
import {
  mapTableFieldsMethod,
  searchBasesMethod,
  searchRecordsMethod,
  searchTablesMethod,
} from "../_shared/methods"
import { updateRecordParams } from "../_shared/parameters"
import {
  resolveBaseId,
  resolveFields,
  resolveRecordId,
  resolveTable,
} from "../_shared/resolve"
import { getAirtableToken } from "../_shared/utils"

export const updateRecordTool = {
  name: "airtable-update-record",
  display_name: t("UPDATE_RECORD_DISPLAY_NAME"),
  description: t("UPDATE_RECORD_DESCRIPTION"),
  icon: "✏️",

  parameters: [...updateRecordParams],
  locator_list: {
    ...searchBasesMethod,
    ...searchTablesMethod,
    ...searchRecordsMethod,
  },
  resource_mapping: { ...mapTableFieldsMethod },
  async invoke({ args }) {
    const token = getAirtableToken(args)
    if (!token) throw new Error(t("ERROR_MISSING_CREDENTIAL").en_US)

    const p = (args as { parameters: Record<string, unknown> }).parameters
    const baseId = resolveBaseId(p)
    const table = resolveTable(p)
    const recordId = resolveRecordId(p)
    const fields = resolveFields(p)
    const typecast = p.typecast === true

    if (!baseId) throw new Error(t("ERROR_BASE_ID_REQUIRED").en_US)
    if (!table) throw new Error(t("ERROR_TABLE_REQUIRED").en_US)
    if (!recordId) throw new Error(t("ERROR_RECORD_ID_REQUIRED").en_US)

    const record = await updateRecord(
      token,
      baseId,
      table,
      recordId,
      fields,
      typecast,
    )
    return { success: true, record }
  },
} satisfies ToolDefinition
