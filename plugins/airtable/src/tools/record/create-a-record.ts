import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createRecord } from "../../api/client"
import { t } from "../../i18n/i18n-node"
import {
  mapTableFieldsMethod,
  searchBasesMethod,
  searchTablesMethod,
} from "../_shared/methods"
import { createRecordParams } from "../_shared/parameters"
import { resolveBaseId, resolveFields, resolveTable } from "../_shared/resolve"
import { getAirtableToken } from "../_shared/utils"

export const createRecordTool = {
  name: "airtable-create-record",
  display_name: t("CREATE_RECORD_DISPLAY_NAME"),
  description: t("CREATE_RECORD_DESCRIPTION"),
  icon: "➕",

  parameters: [...createRecordParams],
  locator_list: { ...searchBasesMethod, ...searchTablesMethod },
  resource_mapping: { ...mapTableFieldsMethod },
  async invoke({ args }) {
    const token = getAirtableToken(args)
    if (!token) throw new Error(t("ERROR_MISSING_CREDENTIAL").en_US)

    const p = (args as { parameters: Record<string, unknown> }).parameters
    const baseId = resolveBaseId(p)
    const table = resolveTable(p)
    const typecast = p.typecast === true
    const fields = await resolveFields(p, token, baseId, table)

    if (!baseId) throw new Error(t("ERROR_BASE_ID_REQUIRED").en_US)
    if (!table) throw new Error(t("ERROR_TABLE_REQUIRED").en_US)

    const record = await createRecord(token, baseId, table, fields, typecast)
    return { success: true, record }
  },
} satisfies ToolDefinition
