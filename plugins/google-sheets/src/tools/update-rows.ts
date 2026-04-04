import type {
  JsonValue,
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";
import { GOOGLE_SHEETS_OAUTH2_CREDENTIAL_NAME } from "../credentials/google-sheets-oauth2";
import { resolveCredential } from "../helpers/credentials";
import { parseUpdateRowsParams } from "../helpers/schemas";
import { callSheets } from "../helpers/sheets-api-error";
import { t } from "../i18n/i18n-node";
import updateRowsSkill from "./update-rows-skill.md" with { type: "text" };

type ParameterNames =
  | "credential_id"
  | "spreadsheet_id"
  | "range"
  | "values"
  | "value_input_option";

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
    name: "value_input_option",
    type: "string",
    required: false,
    display_name: t("PARAM_VALUE_INPUT_OPTION_LABEL"),
    default: "USER_ENTERED",
    enum: ["RAW", "USER_ENTERED"],
    ui: {
      component: "select",
      hint: t("PARAM_VALUE_INPUT_OPTION_HINT"),
      width: "medium",
      support_expression: true,
    },
  },
  {
    name: "values",
    type: "string",
    required: true,
    display_name: t("PARAM_VALUES_LABEL"),
    ui: {
      component: "code-editor",
      language: "json",
      hint: t("PARAM_VALUES_HINT"),
      placeholder: t("PARAM_VALUES_PLACEHOLDER"),
      support_expression: true,
      width: "full",
    },
  },
];

export const updateRowsTool: ToolDefinition = {
  name: "google-sheets-update-rows",
  display_name: t("UPDATE_ROWS_TOOL_DISPLAY_NAME"),
  description: t("UPDATE_ROWS_TOOL_DESCRIPTION"),
  skill: updateRowsSkill,
  icon: "✏️",
  parameters,
  async invoke({ args }) {
    const { spreadsheetId, range, valueInputOption, values } =
      parseUpdateRowsParams(args.parameters ?? {});
    const { sheets } = resolveCredential(args as never);

    const res = await callSheets(() =>
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption,
        requestBody: { range, majorDimension: "ROWS", values },
      }),
    );

    return res.data as unknown as JsonValue;
  },
};
