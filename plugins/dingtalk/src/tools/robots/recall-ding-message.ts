import { z } from "zod"
import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, parseParams } from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
  robot_code: nonEmptyString,
  open_ding_id: nonEmptyString,
})

export const recallDingMessageTool: ToolDefinition = {
  name: "dingtalk-robot-recall-ding",
  display_name: t("ROBOT_RECALL_DING_TOOL_DISPLAY_NAME"),
  description: t("ROBOT_RECALL_DING_TOOL_DESCRIPTION"),
  icon: "↩️",
  parameters: [
    credentialParameter,
    {
      name: "robot_code",
      type: "string",
      required: true,
      display_name: t("PARAM_ROBOT_CODE_LABEL"),
      ai: {
        llm_description: t("ROBOT_RECALL_DING_ROBOT_CODE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "open_ding_id",
      type: "string",
      required: true,
      display_name: t("PARAM_OPEN_DING_ID_LABEL"),
      ai: {
        llm_description: t("ROBOT_RECALL_DING_OPEN_DING_ID_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)

    return dingtalkRequest(credential, {
      method: "POST",
      path: "/robot/ding/recall",
      body: {
        robotCode: params.robot_code,
        openDingId: params.open_ding_id,
      },
    })
  },
}
