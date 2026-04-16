import { z } from "zod"
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, parseParams, stringArray } from "../../lib/schemas"
import {
  buildRobotMessagePayload,
  robotMessageParameter,
  robotMessageSchema,
} from "../../lib/robot-message"
import batchSendRobotMessageSkill from "../../skills/tools/batch-send-robot-message.md" with {
  type: "text",
}

export const batchSendRobotMessageParamsSchema = z
  .object({
    credential_id: z.string(),
    robot_code: nonEmptyString,
    user_ids: stringArray.pipe(
      z
        .array(nonEmptyString)
        .min(1, "user_ids must contain at least 1 userId.")
        .max(20, "user_ids can contain at most 20 userIds."),
    ),
    message: robotMessageSchema,
  })
  .strict()

export const batchSendRobotMessageTool: ToolDefinition = {
  name: "dingtalk-robot-batch-send",
  display_name: t("ROBOT_BATCH_SEND_TOOL_DISPLAY_NAME"),
  description: t("ROBOT_BATCH_SEND_TOOL_DESCRIPTION"),
  icon: "🤖",
  skill: batchSendRobotMessageSkill,
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
      ai: {
        llm_description: t("PARAM_USER_IDS_LLM_DESCRIPTION"),
      },
      min_items: 1,
      max_items: 20,
      items: {
        name: "user_ids_item",
        type: "string",
      },
      ui: {
        component: "tag-input",
        support_expression: true,
        hint: t("PARAM_USER_IDS_HINT"),
      },
    },
    robotMessageParameter,
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(
      batchSendRobotMessageParamsSchema,
      args.parameters,
    )
    const credential = resolveCredential(args)
    const message = buildRobotMessagePayload(params.message)

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
