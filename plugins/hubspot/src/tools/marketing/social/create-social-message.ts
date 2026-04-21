// API docs (deprecated): https://developers.hubspot.com/docs/api-reference/legacy/social-v1/create-broadcast
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { credentialParams } from "../../_shared/parameters"
import type { ToolArgs } from "../../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
} from "../../_shared/utils"

export const createSocialMessageTool = {
  name: "hubspot-create-social-message",
  display_name: t("CREATE_SOCIAL_MESSAGE_DISPLAY_NAME"),
  description: t("CREATE_SOCIAL_MESSAGE_DESCRIPTION"),
  icon: "📢",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "channel_guid",
      type: "string",
      required: true,
      display_name: t("PARAM_SOCIAL_CHANNEL_GUID_LABEL"),
      ai: { llm_description: t("PARAM_SOCIAL_CHANNEL_GUID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_SOCIAL_CHANNEL_GUID_HINT"),
        support_expression: true,
      },
    },
    {
      name: "content",
      type: "string",
      required: true,
      display_name: t("PARAM_SOCIAL_CONTENT_LABEL"),
      ai: { llm_description: t("PARAM_SOCIAL_CONTENT_HINT") },
      ui: {
        component: "textarea",
        hint: t("PARAM_SOCIAL_CONTENT_HINT"),
        placeholder: t("PARAM_SOCIAL_CONTENT_PLACEHOLDER"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const channelGuid = getString(args.parameters, "channel_guid")
    const content = getString(args.parameters, "content")
    if (!channelGuid || !content)
      throw new Error("channel_guid and content are required")

    const body: Record<string, unknown> = { channelGuid, content }
    try {
      const response = await client.apiRequest({
        method: "POST",
        path: "/broadcast/v1/broadcasts",
        body,
      })
      const result = await response.json()
      return { success: true, result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
