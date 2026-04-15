import { z } from "zod"
import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, optionalTrimmedString, parseParams } from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
  user_id: nonEmptyString,
  agent_id: optionalTrimmedString,
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
      required: true,
      display_name: t("PARAM_USER_ID_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_GET_SPACE_INFO_USER_ID_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "agent_id",
      type: "string",
      required: false,
      display_name: t("PARAM_AGENT_ID_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_GET_SPACE_INFO_AGENT_ID_LLM_DESCRIPTION"),
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
      path: "/workflow/processInstances/spaces/infos/query",
      body: {
        userId: params.user_id,
        ...(params.agent_id ? { agentId: params.agent_id } : {}),
      },
    })
  },
}
