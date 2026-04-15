import { z } from "zod"
import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  dingtalkRequest,
  parseJsonParameter,
  resolveCredential,
} from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, parseParams, stringArray } from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
  robot_code: nonEmptyString,
  user_ids: stringArray,
  message_type: z.string().default("text"),
  message_json: z.unknown(),
})

const messageTypeOptions = [
  { label: t("OPTION_MESSAGE_TYPE_TEXT"), value: "text" },
  { label: t("OPTION_MESSAGE_TYPE_LINK"), value: "link" },
  { label: t("OPTION_MESSAGE_TYPE_MARKDOWN"), value: "markdown" },
  { label: t("OPTION_MESSAGE_TYPE_ACTION_CARD"), value: "actionCard" },
  { label: t("OPTION_MESSAGE_TYPE_FEED_CARD"), value: "feedCard" },
]

function buildRobotMessagePayload(
  messageType: string,
  messageJson: unknown,
): { msgKey: string; msgParam: string } {
  const payload = parseJsonParameter<Record<string, unknown>>(
    messageJson,
    "message_json",
  )

  const msgKeyByType: Record<string, string> = {
    text: "sampleText",
    markdown: "sampleMarkdown",
    link: "sampleLink",
    actionCard: "sampleActionCard",
    feedCard: "sampleFeedCard",
  }

  const msgKey = msgKeyByType[messageType]
  if (!msgKey) {
    throw new Error(`Unsupported message_type "${messageType}".`)
  }

  return {
    msgKey,
    msgParam: JSON.stringify(payload),
  }
}

export const batchSendRobotMessageTool: ToolDefinition = {
  name: "dingtalk-robot-batch-send",
  display_name: t("ROBOT_BATCH_SEND_TOOL_DISPLAY_NAME"),
  description: t("ROBOT_BATCH_SEND_TOOL_DESCRIPTION"),
  icon: "🤖",
  parameters: [
    credentialParameter,
    {
      name: "robot_code",
      type: "string",
      required: true,
      display_name: t("PARAM_ROBOT_CODE_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_ROBOT_CODE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "user_ids",
      type: "array",
      required: true,
      display_name: t("PARAM_USER_IDS_LABEL"),
      items: {
        name: "user_ids_item",
        type: "string",
      },
      ui: {
        component: "tag-input",
        hint: t("PARAM_USER_IDS_HINT"),
      },
    },
    {
      name: "message_type",
      type: "string",
      required: false,
      default: "text",
      enum: messageTypeOptions.map((item) => item.value),
      display_name: t("PARAM_MESSAGE_TYPE_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_MESSAGE_TYPE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "select",
        options: messageTypeOptions,
        support_expression: true,
      },
    },
    {
      name: "message_json",
      type: "string",
      required: true,
      display_name: t("PARAM_MESSAGE_JSON_LABEL"),
      ai: {
        llm_description: t("ROBOT_BATCH_SEND_MESSAGE_JSON_LLM_DESCRIPTION"),
      },
      ui: {
        component: "code-editor",
        hint: t("PARAM_MESSAGE_JSON_HINT"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)
    const message = buildRobotMessagePayload(params.message_type, params.message_json)

    return dingtalkRequest(credential, {
      method: "POST",
      path: "/robot/oToMessages/batchSend",
      body: {
        robotCode: params.robot_code,
        userIds: params.user_ids,
        ...message,
      },
    })
  },
}
