import type {
  Property,
  PropertyResourceLocator,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

export const credentialParam = {
  name: "airtable_credential",
  type: "credential_id",
  required: true,
  display_name: t("PARAM_CREDENTIAL_LABEL"),
  credential_name: "airtable",
  ui: { component: "credential-select" },
} satisfies Property<"airtable_credential">

export const BASE_ID_URL_REGEX = "https://airtable.com/([a-zA-Z0-9]{2,})"

export const baseIdParamRL = {
  name: "base_id",
  type: "resource_locator",
  required: true,
  display_name: t("PARAM_BASE_ID_LABEL"),
  ai: {
    llm_description: t("PARAM_BASE_ID_HINT"),
  },
  modes: [
    {
      type: "list",
      search_list_method: "search_bases",
      searchable: true,
      placeholder: t("PARAM_BASE_ID_MODE_LIST_PLACEHOLDER"),
    },
    {
      type: "url",
      placeholder: t("PARAM_BASE_ID_MODE_URL_PLACEHOLDER"),
      extract_value: {
        type: "regex",
        regex: BASE_ID_URL_REGEX,
      },
    },
    {
      type: "id",
      placeholder: t("PARAM_BASE_ID_PLACEHOLDER"),
    },
  ],
  ui: {
    support_expression: true,
  },
} satisfies PropertyResourceLocator<"base_id">

export const TABLE_URL_REGEX =
  "https://airtable.com/[a-zA-Z0-9]{2,}/([a-zA-Z0-9]{2,})"

export const tableParamRL = {
  name: "table",
  type: "resource_locator",
  required: true,
  display_name: t("PARAM_TABLE_LABEL"),
  depends_on: ["base_id"],
  ai: {
    llm_description: t("PARAM_TABLE_HINT"),
  },
  modes: [
    {
      type: "list",
      search_list_method: "search_tables",
      searchable: true,
      placeholder: t("PARAM_TABLE_MODE_LIST_PLACEHOLDER"),
    },
    {
      type: "url",
      placeholder: t("PARAM_TABLE_MODE_URL_PLACEHOLDER"),
      extract_value: {
        type: "regex",
        regex: TABLE_URL_REGEX,
      },
    },
    {
      type: "id",
      placeholder: t("PARAM_TABLE_PLACEHOLDER"),
    },
  ],
  ui: {
    support_expression: true,
  },
} satisfies PropertyResourceLocator<"table">

// example https://airtable.com/appIEXTTK03RREuui/tbltclr7YAfwgA7s9/viwqtYMMNFI9Fz4fd/rec2hTgPf4pjByOfp?blocks=hide
export const RecordID_URL_REGEX =
  "https://airtable.com/[a-zA-Z0-9]{2,}/[a-zA-Z0-9]{2,}/[a-zA-Z0-9]{2,}/([a-zA-Z0-9]{2,})"

export const recordIdParamRL = {
  name: "record_id",
  type: "resource_locator",
  required: true,
  display_name: t("PARAM_RECORD_ID_LABEL"),
  depends_on: ["base_id", "table"],
  ai: {
    llm_description: t("PARAM_RECORD_ID_HINT"),
  },
  modes: [
    {
      type: "list",
      search_list_method: "search_records",
      searchable: true,
      placeholder: t("PARAM_RECORD_ID_MODE_LIST_PLACEHOLDER"),
    },
    {
      type: "url",
      placeholder: t("PARAM_RECORD_ID_MODE_URL_PLACEHOLDER"),
      extract_value: {
        type: "regex",
        regex: RecordID_URL_REGEX,
      },
    },
    {
      type: "id",
      placeholder: t("PARAM_RECORD_ID_PLACEHOLDER"),
    },
  ],
  ui: {
    support_expression: true,
  },
} satisfies PropertyResourceLocator<"record_id">

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
