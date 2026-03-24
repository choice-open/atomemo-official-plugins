import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { GOOGLE_SHEETS_OAUTH2_CREDENTIAL_NAME } from "../credentials/google-sheets-oauth2"
import { resolveCredential } from "../helpers/credentials"
import { t } from "../i18n/i18n-node"

type ParameterNames =
  | "credential_id"
  | "spreadsheet_id"
  | "ranges"
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
    name: "ranges",
    type: "string",
    required: true,
    display_name: t("PARAM_RANGES_LABEL"),
    ui: {
      component: "input",
      hint: t("PARAM_RANGES_HINT"),
      placeholder: t("PARAM_RANGES_PLACEHOLDER"),
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
    ui: { component: "select", width: "medium" },
  },
  {
    name: "value_render_option",
    type: "string",
    required: false,
    display_name: t("PARAM_VALUE_RENDER_OPTION_LABEL"),
    default: "FORMATTED_VALUE",
    enum: ["FORMATTED_VALUE", "UNFORMATTED_VALUE", "FORMULA"],
    ui: { component: "select", width: "medium" },
  },
]

export const batchGetValuesTool: ToolDefinition = {
  name: "google-sheets-batch-get-values",
  display_name: t("BATCH_GET_VALUES_TOOL_DISPLAY_NAME"),
  description: t("BATCH_GET_VALUES_TOOL_DESCRIPTION"),
  icon: "📚",
  parameters,
  async invoke({ args }) {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const { sheets } = resolveCredential(args as never)

    const spreadsheetId =
      typeof p.spreadsheet_id === "string" ? p.spreadsheet_id.trim() : ""
    if (!spreadsheetId) throw new Error("Missing spreadsheet_id")

    const rangesRaw = typeof p.ranges === "string" ? p.ranges.trim() : ""
    if (!rangesRaw) throw new Error("Missing ranges")

    const ranges = rangesRaw
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean)
    if (ranges.length === 0) throw new Error("At least one range is required")

    const majorDimension = (
      typeof p.major_dimension === "string" ? p.major_dimension : "ROWS"
    ) as "ROWS" | "COLUMNS"
    const valueRenderOption = (
      typeof p.value_render_option === "string"
        ? p.value_render_option
        : "FORMATTED_VALUE"
    ) as "FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA"

    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
      majorDimension,
      valueRenderOption,
    })

    return res.data as unknown as JsonValue
  },
}
