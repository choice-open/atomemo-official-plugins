import type { Property } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

export const twitterCredentialParam = {
  name: "twitter_credential",
  type: "credential_id" as const,
  required: true,
  display_name: t("TWITTER_PARAM_CREDENTIAL_LABEL"),
  credential_name: "twitter-oauth",
  ui: { component: "credential-select" as const },
} satisfies Property<"twitter_credential">

export const tweetIdParam = {
  name: "tweet_id",
  type: "string" as const,
  required: true,
  display_name: t("TWITTER_PARAM_TWEET_ID_LABEL"),
  ui: {
    component: "input" as const,
    hint: t("TWITTER_PARAM_TWEET_ID_HINT"),
    support_expression: true,
    width: "full" as const,
  },
} satisfies Property<"tweet_id">

export const userIdParam = {
  name: "user_id",
  type: "string" as const,
  required: true,
  display_name: t("TWITTER_PARAM_USER_ID_LABEL"),
  ui: {
    component: "input" as const,
    hint: t("TWITTER_PARAM_USER_ID_HINT"),
    support_expression: true,
    width: "full" as const,
  },
} satisfies Property<"user_id">

export const usernameParam = {
  name: "username",
  type: "string" as const,
  required: true,
  display_name: t("TWITTER_PARAM_USERNAME_LABEL"),
  ui: {
    component: "input" as const,
    hint: t("TWITTER_PARAM_USERNAME_HINT"),
    placeholder: t("TWITTER_PARAM_USERNAME_PLACEHOLDER"),
    support_expression: true,
    width: "full" as const,
  },
} satisfies Property<"username">

export const maxResultsParam = {
  name: "max_results",
  type: "integer" as const,
  required: false,
  default: 10,
  minimum: 1,
  maximum: 100,
  display_name: t("TWITTER_PARAM_MAX_RESULTS_LABEL"),
  ui: { component: "number-input" as const },
} satisfies Property<"max_results">

export const paginationTokenParam = {
  name: "pagination_token",
  type: "string" as const,
  required: false,
  display_name: t("TWITTER_PARAM_PAGINATION_TOKEN_LABEL"),
  ui: {
    component: "input" as const,
    hint: t("TWITTER_PARAM_PAGINATION_TOKEN_HINT"),
    support_expression: true,
  },
} satisfies Property<"pagination_token">

export const queryParam = {
  name: "query",
  type: "string" as const,
  required: true,
  display_name: t("TWITTER_PARAM_QUERY_LABEL"),
  ui: {
    component: "input" as const,
    hint: t("TWITTER_PARAM_QUERY_HINT"),
    placeholder: t("TWITTER_PARAM_QUERY_PLACEHOLDER"),
    support_expression: true,
    width: "full" as const,
  },
} satisfies Property<"query">
