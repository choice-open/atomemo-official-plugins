import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { GOOGLE_SHEETS_OAUTH2_CREDENTIAL_NAME } from "../credentials/google-sheets-oauth2"
import { resolveCredential } from "../helpers/credentials"
import { t } from "../i18n/i18n-node"

type ParameterNames = "credential_id" | "spreadsheet_id" | "range"

const parameters: Array<Property<ParameterNames>> = [
  {
    name: "credential_id",
    type: "credential_id",
    required: true,
    display_name: t("PARAM_CREDENTIAL_LABEL"),
    credential_name: GOOGLE_SHEETS_OAUTH2_CREDENTIAL_NAME,
    ui: { component: "credential-select" },
  },
  {
    name: "spreadsheet_id",
    type: "string",
    required: true,
    display_name: t("PARAM_SPREADSHEET_ID_LABEL"),
    ui: {
      component: "input",
      hint: t("PARAM_SPREADSHEET_ID_HINT"),
      placeholder: t("PARAM_SPREADSHEET_ID_PLACEHOLDER"),
      support_expression: true,
      width: "full",
    },
  },
  {
    name: "range",
    type: "string",
    required: true,
    display_name: t("PARAM_RANGE_LABEL"),
    ui: {
      component: "input",
      hint: t("PARAM_RANGE_HINT"),
      placeholder: t("PARAM_RANGE_PLACEHOLDER"),
      support_expression: true,
      width: "full",
    },
  },
]

export const clearValuesTool: ToolDefinition = {
  name: "google-sheets-clear-values",
  display_name: t("CLEAR_VALUES_TOOL_DISPLAY_NAME"),
  description: t("CLEAR_VALUES_TOOL_DESCRIPTION"),
  icon: "🧹",
  parameters,
  async invoke({ args }) {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const { sheets } = resolveCredential(args as never)

    const spreadsheetId =
      typeof p.spreadsheet_id === "string" ? p.spreadsheet_id.trim() : ""
    if (!spreadsheetId) throw new Error("Missing spreadsheet_id")

    const range = typeof p.range === "string" ? p.range.trim() : ""
    if (!range) throw new Error("Missing range")

    const res = await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
      requestBody: {},
    })

    return res.data as unknown as JsonValue
  },
}
