import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { GOOGLE_SHEETS_OAUTH2_CREDENTIAL_NAME } from "../credentials/google-sheets-oauth2"
import { resolveCredential } from "../helpers/credentials"
import { parseGetSpreadsheetInfoParams } from "../helpers/schemas"
import { callSheets } from "../helpers/sheets-api-error"
import { t } from "../i18n/i18n-node"

type ParameterNames = "credential_id" | "spreadsheet_id" | "include_grid_data"

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
    name: "include_grid_data",
    type: "boolean",
    required: false,
    display_name: t("PARAM_INCLUDE_GRID_DATA_LABEL"),
    default: false,
    ui: {
      component: "switch",
      hint: t("PARAM_INCLUDE_GRID_DATA_HINT"),
    },
  },
]

export const getSpreadsheetInfoTool: ToolDefinition = {
  name: "google-sheets-get-spreadsheet-info",
  display_name: t("GET_SPREADSHEET_INFO_TOOL_DISPLAY_NAME"),
  description: t("GET_SPREADSHEET_INFO_TOOL_DESCRIPTION"),
  icon: "ℹ️",
  parameters,
  async invoke({ args }) {
    const params = parseGetSpreadsheetInfoParams(args.parameters ?? {})
    const { sheets } = resolveCredential(args as never)

    const res = await callSheets(() => sheets.spreadsheets.get(params))

    return res.data as unknown as JsonValue
  },
}
