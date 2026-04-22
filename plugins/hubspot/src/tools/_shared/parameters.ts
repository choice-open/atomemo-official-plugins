import type {
  Property,
  PropertyResourceLocator,
  PropertyResourceMapper,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

// ── Credential Parameters ───────────────────────────────────────────

const hubspotOAuth2CredentialParam = {
  name: "hubspot_oauth2_credential",
  type: "credential_id",
  required: true,
  display_name: t("PARAM_OAUTH2_CREDENTIAL_LABEL"),
  credential_name: "hubspot-oauth2",
  ui: { component: "credential-select" },
} satisfies Property<"hubspot_oauth2_credential">

export const credentialParams = [hubspotOAuth2CredentialParam] as const

// ── Object Type Parameter (for generic CRM tools) ──────────────────

export const objectTypeParam = {
  name: "object_type",
  type: "string",
  required: true,
  display_name: t("PARAM_OBJECT_TYPE_LABEL"),
  ai: { llm_description: t("PARAM_OBJECT_TYPE_HINT") },
  ui: {
    component: "input",
    hint: t("PARAM_OBJECT_TYPE_HINT"),
    placeholder: t("PARAM_OBJECT_TYPE_PLACEHOLDER"),
    support_expression: true,
  },
} satisfies Property<"object_type">

// ── Object ID Parameter ─────────────────────────────────────────────

export const objectIdParam = {
  name: "object_id",
  type: "string",
  required: true,
  display_name: t("PARAM_OBJECT_ID_LABEL"),
  ai: { llm_description: t("PARAM_OBJECT_ID_HINT") },
  ui: {
    component: "input",
    hint: t("PARAM_OBJECT_ID_HINT"),
    placeholder: t("PARAM_OBJECT_ID_PLACEHOLDER"),
    support_expression: true,
  },
} satisfies Property<"object_id">

// ── Properties Resource Mapper ──────────────────────────────────────

export const propertiesParam = {
  name: "properties",
  type: "resource_mapper",
  required: true,
  display_name: t("PARAM_PROPERTIES_LABEL"),
  ai: { llm_description: t("PARAM_PROPERTIES_HINT") },
  mapping_method: "map_object_properties",
} satisfies PropertyResourceMapper<"properties">

export const propertiesOptionalParam = {
  name: "properties",
  type: "resource_mapper",
  required: false,
  display_name: t("PARAM_PROPERTIES_LABEL"),
  ai: { llm_description: t("PARAM_PROPERTIES_HINT") },
  mapping_method: "map_object_properties",
} satisfies PropertyResourceMapper<"properties">

export const genericObjectPropertiesParam = {
  ...propertiesParam,
  depends_on: ["object_type"],
} satisfies PropertyResourceMapper<"properties">

export const genericObjectPropertiesOptionalParam = {
  ...propertiesOptionalParam,
  depends_on: ["object_type"],
} satisfies PropertyResourceMapper<"properties">

// ── Search / Filter Parameters ──────────────────────────────────────

export const searchQueryParam = {
  name: "search_query",
  type: "string",
  required: false,
  display_name: t("PARAM_SEARCH_QUERY_LABEL"),
  ai: { llm_description: t("PARAM_SEARCH_QUERY_HINT") },
  ui: {
    component: "input",
    hint: t("PARAM_SEARCH_QUERY_HINT"),
    placeholder: t("PARAM_SEARCH_QUERY_PLACEHOLDER"),
    support_expression: true,
    width: "full",
  },
} satisfies Property<"search_query">

export const filterGroupsParam = {
  name: "filter_groups",
  type: "array",
  required: false,
  display_name: t("PARAM_FILTER_GROUPS_LABEL"),
  ai: { llm_description: t("PARAM_FILTER_GROUPS_HINT") },
  ui: { component: "array-section" },
  items: {
    type: "object",
    name: "filter_group",
    properties: [
      {
        name: "filters",
        type: "array",
        required: true,
        display_name: t("PARAM_FILTERS_LABEL"),
        ui: { component: "array-section" },
        items: {
          type: "object",
          name: "filter",
          properties: [
            {
              name: "propertyName",
              type: "string",
              required: true,
              display_name: t("PARAM_FILTER_PROPERTY_NAME_LABEL"),
              ui: { component: "input", support_expression: true },
            },
            {
              name: "operator",
              type: "string",
              required: true,
              display_name: t("PARAM_FILTER_OPERATOR_LABEL"),
              ui: {
                component: "select",
                options: [
                  { label: t("FILTER_OP_EQ"), value: "EQ" },
                  { label: t("FILTER_OP_NEQ"), value: "NEQ" },
                  { label: t("FILTER_OP_LT"), value: "LT" },
                  { label: t("FILTER_OP_LTE"), value: "LTE" },
                  { label: t("FILTER_OP_GT"), value: "GT" },
                  { label: t("FILTER_OP_GTE"), value: "GTE" },
                  { label: t("FILTER_OP_CONTAINS"), value: "CONTAINS_TOKEN" },
                  {
                    label: t("FILTER_OP_NOT_CONTAINS"),
                    value: "NOT_CONTAINS_TOKEN",
                  },
                  { label: t("FILTER_OP_HAS_PROPERTY"), value: "HAS_PROPERTY" },
                  {
                    label: t("FILTER_OP_NOT_HAS_PROPERTY"),
                    value: "NOT_HAS_PROPERTY",
                  },
                ],
              },
            },
            {
              name: "value",
              type: "string",
              required: false,
              display_name: t("PARAM_FILTER_VALUE_LABEL"),
              ui: { component: "input", support_expression: true },
            },
          ],
        },
      },
    ],
  },
} satisfies Property<"filter_groups">

export const limitParam = {
  name: "limit",
  type: "integer",
  required: false,
  default: 100,
  minimum: 1,
  maximum: 200,
  display_name: t("PARAM_LIMIT_LABEL"),
  ui: {
    component: "number-input",
    hint: t("PARAM_LIMIT_HINT"),
    support_expression: true,
  },
} satisfies Property<"limit">

// ── Return Properties Parameter ─────────────────────────────────────

export const returnPropertiesParam = {
  name: "return_properties",
  type: "array",
  required: false,
  display_name: t("PARAM_RETURN_PROPERTIES_LABEL"),
  ai: { llm_description: t("PARAM_RETURN_PROPERTIES_HINT") },
  ui: {
    component: "tag-input",
    hint: t("PARAM_RETURN_PROPERTIES_HINT"),
    support_expression: true,
  },
  items: {
    name: "property_name",
    type: "string",
  },
} satisfies Property<"return_properties">

export const associationsParam = {
  name: "return_associations",
  type: "array",
  required: false,
  display_name: t("PARAM_RETURN_ASSOCIATIONS_LABEL"),
  ai: { llm_description: t("PARAM_RETURN_ASSOCIATIONS_HINT") },
  ui: {
    component: "tag-input",
    hint: t("PARAM_RETURN_ASSOCIATIONS_HINT"),
    support_expression: true,
  },
  items: {
    name: "association_type",
    type: "string",
  },
} satisfies Property<"return_associations">

// ── Upsert Mode (for update tools) ─────────────────────────────────

export const upsertParam = {
  name: "upsert",
  type: "boolean",
  required: false,
  default: false,
  display_name: t("PARAM_UPSERT_LABEL"),
  ui: {
    component: "switch",
    hint: t("PARAM_UPSERT_HINT"),
    support_expression: true,
  },
} satisfies Property<"upsert">

export const idPropertyParam = {
  name: "id_property",
  type: "string",
  required: false,
  display_name: t("PARAM_ID_PROPERTY_LABEL"),
  ai: { llm_description: t("PARAM_ID_PROPERTY_HINT") },
  ui: {
    component: "input",
    hint: t("PARAM_ID_PROPERTY_HINT"),
    placeholder: t("PARAM_ID_PROPERTY_PLACEHOLDER"),
    support_expression: true,
  },
} satisfies Property<"id_property">

export const workflowIdParam = {
  name: "workflow_id",
  type: "resource_locator",
  required: true,
  display_name: t("PARAM_WORKFLOW_ID_LABEL"),
  ai: { llm_description: t("PARAM_WORKFLOW_ID_HINT") },
  modes: [
    {
      type: "list",
      search_list_method: "search_workflows",
      searchable: true,
      placeholder: t("PARAM_WORKFLOW_ID_MODE_LIST_PLACEHOLDER"),
    },
    {
      type: "id",
      placeholder: t("PARAM_WORKFLOW_ID_PLACEHOLDER"),
    },
  ],
  ui: { support_expression: true },
} satisfies PropertyResourceLocator<"workflow_id">

export const listIdParam = {
  name: "list_id",
  type: "resource_locator",
  required: true,
  display_name: t("PARAM_LIST_ID_LABEL"),
  ai: { llm_description: t("PARAM_LIST_ID_HINT") },
  modes: [
    {
      type: "list",
      search_list_method: "search_lists",
      searchable: true,
      placeholder: t("PARAM_LIST_ID_MODE_LIST_PLACEHOLDER"),
    },
    {
      type: "id",
      placeholder: t("PARAM_LIST_ID_PLACEHOLDER"),
    },
  ],
  ui: { support_expression: true },
} satisfies PropertyResourceLocator<"list_id">

export const ownerIdParam = {
  name: "owner_id",
  type: "resource_locator",
  required: true,
  display_name: t("PARAM_OWNER_ID_LABEL"),
  ai: { llm_description: t("PARAM_OWNER_ID_HINT") },
  modes: [
    {
      type: "list",
      search_list_method: "search_owners",
      searchable: true,
      placeholder: t("PARAM_OWNER_ID_MODE_LIST_PLACEHOLDER"),
    },
    {
      type: "id",
      placeholder: t("PARAM_OWNER_ID_PLACEHOLDER"),
    },
  ],
  ui: { support_expression: true },
} satisfies PropertyResourceLocator<"owner_id">

export const fileIdParam = {
  name: "file_id",
  type: "resource_locator",
  required: true,
  display_name: t("PARAM_FILE_ID_LABEL"),
  ai: { llm_description: t("PARAM_FILE_ID_HINT") },
  modes: [
    {
      type: "list",
      search_list_method: "search_files",
      searchable: true,
      placeholder: t("PARAM_FILE_ID_MODE_LIST_PLACEHOLDER"),
    },
    {
      type: "id",
      placeholder: t("PARAM_FILE_ID_PLACEHOLDER"),
    },
  ],
  ui: { support_expression: true },
} satisfies PropertyResourceLocator<"file_id">

export const folderIdParam = {
  name: "folder_id",
  type: "resource_locator",
  required: false,
  display_name: t("PARAM_FILE_FOLDER_ID_LABEL"),
  ai: { llm_description: t("PARAM_FILE_FOLDER_ID_HINT") },
  modes: [
    {
      type: "list",
      search_list_method: "search_folders",
      searchable: true,
      placeholder: t("PARAM_FILE_FOLDER_ID_MODE_LIST_PLACEHOLDER"),
    },
    {
      type: "id",
      placeholder: t("PARAM_FILE_FOLDER_ID_PLACEHOLDER"),
    },
  ],
  ui: { support_expression: true },
} satisfies PropertyResourceLocator<"folder_id">

export const contactIdsParam = {
  name: "contact_ids",
  type: "array",
  required: true,
  display_name: t("PARAM_CONTACT_IDS_LABEL"),
  ai: { llm_description: t("PARAM_CONTACT_IDS_HINT") },
  ui: {
    component: "tag-input",
    hint: t("PARAM_CONTACT_IDS_HINT"),
    support_expression: true,
  },
  items: {
    name: "contact_id",
    type: "string",
  },
} satisfies Property<"contact_ids">

export const fromIdsParam = {
  name: "from_ids",
  type: "array",
  required: true,
  display_name: t("PARAM_FROM_IDS_LABEL"),
  ai: { llm_description: t("PARAM_FROM_IDS_HINT") },
  ui: {
    component: "tag-input",
    hint: t("PARAM_FROM_IDS_HINT"),
    support_expression: true,
  },
  items: {
    name: "from_object_id",
    type: "string",
  },
} satisfies Property<"from_ids">
