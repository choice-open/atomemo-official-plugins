import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { hackerNewsApiRequest, normalizeUser } from "./hacker-news-api"
import skill from "./skills/get-hacker-news-user.md"

export const getHackerNewsUserTool = {
  name: "get-hacker-news-user",
  display_name: t("GET_HACKER_NEWS_USER_TOOL_DISPLAY_NAME"),
  description: t("GET_HACKER_NEWS_USER_TOOL_DESCRIPTION"),
  icon: "📰",
  skill,
  parameters: [
    {
      name: "username",
      type: "string",
      required: true,
      default: "",
      min_length: 1,
      display_name: t("USERNAME_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("USERNAME_HINT"),
        placeholder: t("USERNAME_PLACEHOLDER"),
        support_expression: true,
        width: "medium",
      },
      ai: { llm_description: t("USERNAME_LLM_DESCRIPTION") },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      username: string
    }

    const responseData = await hackerNewsApiRequest(`users/${params.username}`)
    return {
      user: normalizeUser(responseData),
    }
  },
} satisfies ToolDefinition
