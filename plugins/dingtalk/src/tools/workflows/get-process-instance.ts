import { z } from "zod"
import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, parseParams } from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
  process_instance_id: nonEmptyString,
})

export const getProcessInstanceTool: ToolDefinition = {
  name: "dingtalk-workflow-get-process-instance",
  display_name: t("WORKFLOW_GET_INSTANCE_TOOL_DISPLAY_NAME"),
  description: t("WORKFLOW_GET_INSTANCE_TOOL_DESCRIPTION"),
  icon: "📄",
  parameters: [
    credentialParameter,
    {
      name: "process_instance_id",
      type: "string",
      required: true,
      display_name: t("PARAM_PROCESS_INSTANCE_ID_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_GET_INSTANCE_PROCESS_INSTANCE_ID_LLM_DESCRIPTION"),
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
      method: "GET",
      path: "/workflow/processInstances",
      query: {
        processInstanceId: params.process_instance_id,
      },
    })
  },
}
