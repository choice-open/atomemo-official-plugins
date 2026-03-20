import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { requireTwitterClient } from "../lib/require-twitter"
import { getSkill } from "../skills"
import { twitterCredentialParam } from "./_shared/parameters"

export const createTweetTool = {
  name: "twitter-create-tweet",
  display_name: t("TWITTER_TOOL_CREATE_TWEET_DISPLAY_NAME"),
  description: t("TWITTER_TOOL_CREATE_TWEET_DESCRIPTION"),
  icon: "✏️",
  skill: getSkill("create-tweet"),
  parameters: [
    twitterCredentialParam,
    {
      name: "text",
      type: "string",
      required: true,
      display_name: t("TWITTER_PARAM_TEXT_LABEL"),
      ui: {
        component: "textarea",
        hint: t("TWITTER_PARAM_TEXT_HINT"),
        placeholder: t("TWITTER_PARAM_TEXT_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "reply_to_tweet_id",
      type: "string",
      required: false,
      display_name: t("TWITTER_PARAM_REPLY_TO_TWEET_ID_LABEL"),
      ui: {
        component: "input",
        hint: t("TWITTER_PARAM_REPLY_TO_TWEET_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "quote_tweet_id",
      type: "string",
      required: false,
      display_name: t("TWITTER_PARAM_QUOTE_TWEET_ID_LABEL"),
      ui: {
        component: "input",
        hint: t("TWITTER_PARAM_QUOTE_TWEET_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = requireTwitterClient(
      args.credentials,
      args.parameters.twitter_credential,
    )
    const { text, reply_to_tweet_id, quote_tweet_id } = args.parameters

    const body: Record<string, unknown> = { text }
    if (reply_to_tweet_id) {
      body.reply = { inReplyToTweetId: reply_to_tweet_id }
    }
    if (quote_tweet_id) {
      body.quoteTweetId = quote_tweet_id
    }

    const res = await client.posts.create(body as any)
    return { data: res.data } as any
  },
} satisfies ToolDefinition
