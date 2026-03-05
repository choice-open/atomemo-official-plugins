import type { Property } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

export const credentialParam = {
  name: "airtable_credential",
  type: "credential_id",
  required: true,
  display_name: t("PARAM_CREDENTIAL_LABEL"),
  credential_name: "airtable",
  ui: { component: "credential-select" },
} satisfies Property<"airtable_credential">

export const baseIdParam = {
  name: "base_id",
  type: "string",
  required: true,
  display_name: t("PARAM_BASE_ID_LABEL"),
  ui: {
    component: "input",
    hint: t("PARAM_BASE_ID_HINT"),
    placeholder: t("PARAM_BASE_ID_PLACEHOLDER"),
    support_expression: true,
    width: "full",
  },
} satisfies Property<"base_id">

export const tableParam = {
  name: "table",
  type: "string",
  required: true,
  display_name: t("PARAM_TABLE_LABEL"),
  ui: {
    component: "input",
    hint: t("PARAM_TABLE_HINT"),
    placeholder: t("PARAM_TABLE_PLACEHOLDER"),
    support_expression: true,
    width: "full",
  },
} satisfies Property<"table">

export const recordIdParam = {
  name: "record_id",
  type: "string",
  required: true,
  display_name: t("PARAM_RECORD_ID_LABEL"),
  ui: {
    component: "input",
    hint: t("PARAM_RECORD_ID_HINT"),
    placeholder: t("PARAM_RECORD_ID_PLACEHOLDER"),
    support_expression: true,
    width: "full",
  },
} satisfies Property<"record_id">

export const typecastParam = {
  name: "typecast",
  type: "boolean",
  required: false,
  default: false,
  display_name: t("PARAM_TYPECAST_LABEL"),
  ui: {
    component: "switch",
    hint: t("PARAM_TYPECAST_HINT"),
    support_expression: true,
  },
} satisfies Property<"typecast">

export const fieldsParam = {
  name: "fields",
  type: "string",
  required: true,
  display_name: t("PARAM_FIELDS_LABEL"),
  ui: {
    component: "code-editor",
    hint: t("PARAM_FIELDS_HINT"),
    placeholder: {
      en_US:
        'Example: {"Name": "John", "Status": "Active", "Score": 5, "Project": ["recXXX"]}',
      zh_Hans:
        '示例：{"Name": "John", "Status": "Active", "Score": 5, "Project": ["recXXX"]}',
    },
    language: "json",
    rows: 8,
    support_expression: true,
    width: "full",
  },
} satisfies Property<"fields">
