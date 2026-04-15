import { z } from "zod"
import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  dingtalkRequest,
  resolveCredential,
  resolveOperatorUserId,
} from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { optionalTrimmedString, parseParams } from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
  user_id: optionalTrimmedString,
})

export const getProcessSpaceInfoTool: ToolDefinition = {
  name: "dingtalk-workflow-get-process-space-info",
  display_name: t("WORKFLOW_GET_SPACE_INFO_TOOL_DISPLAY_NAME"),
  description: t("WORKFLOW_GET_SPACE_INFO_TOOL_DESCRIPTION"),
  icon: "🗄️",
  parameters: [
    credentialParameter,
    {
      name: "user_id",
      type: "string",
      required: false,
      display_name: t("PARAM_USER_ID_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_GET_SPACE_INFO_USER_ID_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        hint: t("PARAM_USER_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)
    const userId = params.user_id ?? (await resolveOperatorUserId(credential))
    const agentId = credential?.agent_id?.trim() || undefined
    if (!agentId) {
      throw new Error(
        "This operation requires an agentId. Set agent_id on the DingTalk credential.",
      )
    }
    return dingtalkRequest(credential, {
      method: "POST",
      path: "/workflow/processInstances/spaces/infos/query",
      body: {
        userId,
        agentId,
      },
    })
  },
}
