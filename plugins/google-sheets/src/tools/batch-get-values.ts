import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { GOOGLE_SHEETS_OAUTH2_CREDENTIAL_NAME } from "../credentials/google-sheets-oauth2";
import { resolveCredential } from "../helpers/credentials";
import { parseBatchGetValuesParams } from "../helpers/schemas";
import { callSheets } from "../helpers/sheets-api-error";
import { t } from "../i18n/i18n-node";
import batchGetValuesSkill from "./batch-get-values-skill.md" with { type: "text" };

type ParameterNames =
  | "credential_id"
  | "spreadsheet_id"
  | "ranges"
  | "major_dimension"
  | "value_render_option";

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
];

export const batchGetValuesTool: ToolDefinition = {
  name: "google-sheets-batch-get-values",
  display_name: t("BATCH_GET_VALUES_TOOL_DISPLAY_NAME"),
  description: t("BATCH_GET_VALUES_TOOL_DESCRIPTION"),
  skill: batchGetValuesSkill,
  icon: "📚",
  parameters,
  async invoke({ args }) {
    const params = parseBatchGetValuesParams(args.parameters ?? {});
    const { sheets } = resolveCredential(args as never);

    const res = await callSheets(() =>
      sheets.spreadsheets.values.batchGet(params),
    );

    return res.data as unknown as JsonValue;
  },
};
