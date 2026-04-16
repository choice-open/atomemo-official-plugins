import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, parseParams } from "../../lib/schemas"
import {
  buildRobotMessagePayload,
  robotMessageParameter,
  robotMessageSchema,
} from "../../lib/robot-message"

export const sendGroupRobotMessageParamsSchema = z
  .object({
    credential_id: z.string(),
    robot_code: nonEmptyString,
    open_conversation_id: nonEmptyString,
    message: robotMessageSchema,
  })
  .strict()

export const sendGroupRobotMessageTool: ToolDefinition = {
  name: "dingtalk-robot-send-group-message",
  display_name: t("ROBOT_SEND_GROUP_TOOL_DISPLAY_NAME"),
  description: t("ROBOT_SEND_GROUP_TOOL_DESCRIPTION"),
  icon: "💬",
  parameters: [
    credentialParameter,
    {
      name: "robot_code",
      type: "string",
      required: true,
      display_name: t("PARAM_ROBOT_CODE_LABEL"),
      ai: {
        llm_description: t("ROBOT_SEND_GROUP_ROBOT_CODE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "open_conversation_id",
      type: "string",
      required: true,
      display_name: t("PARAM_OPEN_CONVERSATION_ID_LABEL"),
      ai: {
        llm_description: t(
          "ROBOT_SEND_GROUP_OPEN_CONVERSATION_ID_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    robotMessageParameter,
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(sendGroupRobotMessageParamsSchema, args.parameters)
    const credential = resolveCredential(args)
    const message = buildRobotMessagePayload(params.message)

    return dingtalkRequest(credential, {
      method: "POST",
      path: "/robot/groupMessages/send",
      body: {
        robotCode: params.robot_code,
        openConversationId: params.open_conversation_id,
        ...message,
      },
    })
  },
}
