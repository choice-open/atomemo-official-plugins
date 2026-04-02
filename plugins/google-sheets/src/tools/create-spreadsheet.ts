import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { GOOGLE_SHEETS_OAUTH2_CREDENTIAL_NAME } from "../credentials/google-sheets-oauth2"
import { resolveCredential } from "../helpers/credentials"
import { parseCreateSpreadsheetParams } from "../helpers/schemas"
import { callSheets } from "../helpers/sheets-api-error"
import { t } from "../i18n/i18n-node"
import createSpreadsheetSkill from "./create-spreadsheet-skill.md" with {
  type: "text",
}

type ParameterNames = "credential_id" | "title" | "sheet_titles"

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
    name: "title",
    type: "string",
    required: true,
    display_name: t("PARAM_TITLE_LABEL"),
    ui: {
      component: "input",
      hint: t("PARAM_TITLE_HINT"),
      placeholder: t("PARAM_TITLE_PLACEHOLDER"),
      support_expression: true,
      width: "full",
    },
  },
  {
    name: "sheet_titles",
    type: "string",
    required: false,
    display_name: t("PARAM_SHEET_TITLES_LABEL"),
    ui: {
      component: "input",
      hint: t("PARAM_SHEET_TITLES_HINT"),
      placeholder: t("PARAM_SHEET_TITLES_PLACEHOLDER"),
      support_expression: true,
      width: "full",
    },
  },
]

export const createSpreadsheetTool: ToolDefinition = {
  name: "google-sheets-create-spreadsheet",
  display_name: t("CREATE_SPREADSHEET_TOOL_DISPLAY_NAME"),
  description: t("CREATE_SPREADSHEET_TOOL_DESCRIPTION"),
  skill: createSpreadsheetSkill,
  icon: "📝",
  parameters,
  async invoke({ args }) {
    const { requestBody } = parseCreateSpreadsheetParams(args.parameters ?? {})
    const { sheets } = resolveCredential(args as never)

    const res = await callSheets(() =>
      sheets.spreadsheets.create({ requestBody }),
    )

    return res.data as unknown as JsonValue
  },
}
