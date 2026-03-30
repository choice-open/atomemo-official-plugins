import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { GOOGLE_SHEETS_OAUTH2_CREDENTIAL_NAME } from "../credentials/google-sheets-oauth2"
import { resolveCredential } from "../helpers/credentials"
import { parseReadRowsParams } from "../helpers/schemas"
import { callSheets } from "../helpers/sheets-api-error"
import { t } from "../i18n/i18n-node"
import readRowsSkill from "./read-rows-skill.md" with { type: "text" }

type ParameterNames =
  | "credential_id"
  | "spreadsheet_id"
  | "range"
  | "major_dimension"
  | "value_render_option"

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
  {
    name: "major_dimension",
    type: "string",
    required: false,
    display_name: t("PARAM_MAJOR_DIMENSION_LABEL"),
    default: "ROWS",
    enum: ["ROWS", "COLUMNS"],
    ui: {
      component: "select",
      hint: t("PARAM_MAJOR_DIMENSION_HINT"),
      width: "medium",
      support_expression: true,
    },
  },
  {
    name: "value_render_option",
    type: "string",
    required: false,
    display_name: t("PARAM_VALUE_RENDER_OPTION_LABEL"),
    default: "FORMATTED_VALUE",
    enum: ["FORMATTED_VALUE", "UNFORMATTED_VALUE", "FORMULA"],
    ui: {
      component: "select",
      hint: t("PARAM_VALUE_RENDER_OPTION_HINT"),
      width: "medium",
      support_expression: true,
    },
  },
]

export const readRowsTool: ToolDefinition = {
  name: "google-sheets-read-rows",
  display_name: t("READ_ROWS_TOOL_DISPLAY_NAME"),
  description: t("READ_ROWS_TOOL_DESCRIPTION"),
  skill: readRowsSkill,
  icon: "📖",
  parameters,
  async invoke({ args }) {
    const params = parseReadRowsParams(args.parameters ?? {})
    const { sheets } = resolveCredential(args as never)

    const res = await callSheets(() => sheets.spreadsheets.values.get(params))

    return res.data as unknown as JsonValue
  },
}
