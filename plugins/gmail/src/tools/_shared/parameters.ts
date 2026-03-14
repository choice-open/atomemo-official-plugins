import type { Property } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

export const gmailCredentialParam = {
  name: "gmail_credential",
  type: "credential_id" as const,
  required: true,
  display_name: t("GMAIL_PARAM_CREDENTIAL_LABEL"),
  credential_name: "gmail-oauth",
  ui: { component: "credential-select" as const },
} satisfies Property<"gmail_credential">

export const userIdParam = {
  name: "user_id",
  type: "string" as const,
  required: false,
  default: "me",
  display_name: t("GMAIL_PARAM_USER_ID_LABEL"),
  ui: {
    component: "input" as const,
    hint: t("GMAIL_PARAM_USER_ID_HINT"),
    support_expression: true,
    width: "medium" as const,
  },
} satisfies Property<"user_id">

export const messageIdParam = {
  name: "message_id",
  type: "string" as const,
  required: true,
  display_name: t("GMAIL_PARAM_MESSAGE_ID_LABEL"),
  ui: {
    component: "input" as const,
    hint: t("GMAIL_PARAM_MESSAGE_ID_HINT"),
    support_expression: true,
    width: "full" as const,
  },
} satisfies Property<"message_id">

export const threadIdParam = {
  name: "thread_id",
  type: "string" as const,
  required: true,
  display_name: t("GMAIL_PARAM_THREAD_ID_LABEL"),
  ui: {
    component: "input" as const,
    support_expression: true,
    width: "full" as const,
  },
} satisfies Property<"thread_id">

export const labelIdParam = {
  name: "label_id",
  type: "string" as const,
  required: true,
  display_name: t("GMAIL_PARAM_LABEL_ID_LABEL"),
  ui: {
    component: "input" as const,
    support_expression: true,
    width: "full" as const,
  },
} satisfies Property<"label_id">

export const draftIdParam = {
  name: "draft_id",
  type: "string" as const,
  required: true,
  display_name: t("GMAIL_PARAM_DRAFT_ID_LABEL"),
  ui: {
    component: "input" as const,
    support_expression: true,
    width: "full" as const,
  },
} satisfies Property<"draft_id">

export const maxResultsParam = {
  name: "max_results",
  type: "integer" as const,
  required: false,
  default: 50,
  minimum: 1,
  maximum: 500,
  display_name: t("GMAIL_PARAM_MAX_RESULTS_LABEL"),
  ui: { component: "number-input" as const },
} satisfies Property<"max_results">

export const pageTokenParam = {
  name: "page_token",
  type: "string" as const,
  required: false,
  display_name: t("GMAIL_PARAM_PAGE_TOKEN_LABEL"),
  ui: { component: "input" as const },
} satisfies Property<"page_token">

export const qParam = {
  name: "q",
  type: "string" as const,
  required: false,
  display_name: t("GMAIL_PARAM_QUERY_LABEL"),
  ui: {
    component: "input" as const,
    hint: t("GMAIL_PARAM_QUERY_HINT"),
    placeholder: t("GMAIL_PARAM_QUERY_PLACEHOLDER"),
    support_expression: true,
    width: "full" as const,
  },
} satisfies Property<"q">

export const labelIdsParam = {
  name: "label_ids",
  type: "array" as const,
  required: false,
  display_name: t("GMAIL_PARAM_LABEL_IDS_LABEL"),
  items: { name: "item", type: "string" as const },
  ui: {
    component: "tag-input" as const,
    hint: t("GMAIL_PARAM_LABEL_IDS_HINT"),
    width: "full" as const,
  },
} satisfies Property<"label_ids">
