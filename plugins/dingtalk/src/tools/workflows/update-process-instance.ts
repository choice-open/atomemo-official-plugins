import { z } from "zod"
import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  dingtalkRequest,
  parseJsonParameter,
  resolveCredential,
} from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import {
  nonEmptyString,
  optionalTrimmedString,
  parseParams,
} from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
  op_user_id: nonEmptyString,
  process_code: optionalTrimmedString,
  process_instance_id: nonEmptyString,
  variables_json: z.unknown(),
  remark: optionalTrimmedString,
})

export const updateProcessInstanceTool: ToolDefinition = {
  name: "dingtalk-workflow-update-process-instance",
  display_name: t("WORKFLOW_UPDATE_INSTANCE_TOOL_DISPLAY_NAME"),
  description: t("WORKFLOW_UPDATE_INSTANCE_TOOL_DESCRIPTION"),
  icon: "✏️",
  parameters: [
    credentialParameter,
    {
      name: "op_user_id",
      type: "string",
      required: true,
      display_name: t("PARAM_OP_USER_ID_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_UPDATE_INSTANCE_OP_USER_ID_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "process_code",
      type: "string",
      required: false,
      display_name: t("PARAM_PROCESS_CODE_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_UPDATE_INSTANCE_PROCESS_CODE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "process_instance_id",
      type: "string",
      required: true,
      display_name: t("PARAM_PROCESS_INSTANCE_ID_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_UPDATE_INSTANCE_PROCESS_INSTANCE_ID_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "variables_json",
      type: "string",
      required: true,
      display_name: t("PARAM_VARIABLES_JSON_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_UPDATE_INSTANCE_VARIABLES_JSON_LLM_DESCRIPTION"),
      },
      ui: {
        component: "code-editor",
        hint: t("PARAM_VARIABLES_JSON_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "remark",
      type: "string",
      required: false,
      display_name: t("PARAM_REMARK_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_UPDATE_INSTANCE_REMARK_LLM_DESCRIPTION"),
      },
      ui: {
        component: "textarea",
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)
    const variables = parseJsonParameter<Array<Record<string, unknown>>>(
      params.variables_json,
      "variables_json",
    )

    if (!Array.isArray(variables) || variables.length === 0) {
      throw new Error("variables_json must be a non-empty JSON array.")
    }

    return dingtalkRequest(credential, {
      method: "PUT",
      path: "/workflow/premium/processInstances",
      body: {
        opUserId: params.op_user_id,
        processInstanceId: params.process_instance_id,
        variables,
        ...(params.process_code ? { processCode: params.process_code } : {}),
        ...(params.remark ? { remark: params.remark } : {}),
      },
    })
  },
}
