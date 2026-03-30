import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { GOOGLE_SHEETS_OAUTH2_CREDENTIAL_NAME } from "../credentials/google-sheets-oauth2"
import { resolveCredential } from "../helpers/credentials"
import { parseCopySheetParams } from "../helpers/schemas"
import { callSheets } from "../helpers/sheets-api-error"
import { t } from "../i18n/i18n-node"
import copySheetSkill from "./copy-sheet-skill.md" with { type: "text" }

type ParameterNames =
  | "credential_id"
  | "spreadsheet_id"
  | "sheet_id"
  | "destination_spreadsheet_id"

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
      hint: t("PARAM_SOURCE_SPREADSHEET_ID_HINT"),
      placeholder: t("PARAM_SPREADSHEET_ID_PLACEHOLDER"),
      support_expression: true,
      width: "full",
    },
  },
  {
    name: "sheet_id",
    type: "number",
    required: true,
    display_name: t("PARAM_SHEET_ID_LABEL"),
    ui: {
      component: "number-input",
      hint: t("PARAM_SHEET_ID_HINT"),
      placeholder: t("PARAM_SHEET_ID_PLACEHOLDER"),
      support_expression: true,
      width: "full",
    },
  },
  {
    name: "destination_spreadsheet_id",
    type: "string",
    required: true,
    display_name: t("PARAM_DESTINATION_SPREADSHEET_ID_LABEL"),
    ui: {
      component: "input",
      hint: t("PARAM_DESTINATION_SPREADSHEET_ID_HINT"),
      placeholder: t("PARAM_SPREADSHEET_ID_PLACEHOLDER"),
      support_expression: true,
      width: "full",
    },
  },
]

export const copySheetTool: ToolDefinition = {
  name: "google-sheets-copy-sheet",
  display_name: t("COPY_SHEET_TOOL_DISPLAY_NAME"),
  description: t("COPY_SHEET_TOOL_DESCRIPTION"),
  skill: copySheetSkill,
  icon: "📋",
  parameters,
  async invoke({ args }) {
    const { spreadsheetId, sheetId, destinationSpreadsheetId } =
      parseCopySheetParams(args.parameters ?? {})
    const { sheets } = resolveCredential(args as never)

    const res = await callSheets(() =>
      sheets.spreadsheets.sheets.copyTo({
        spreadsheetId,
        sheetId,
        requestBody: { destinationSpreadsheetId },
      }),
    )

    return res.data as unknown as JsonValue
  },
}
