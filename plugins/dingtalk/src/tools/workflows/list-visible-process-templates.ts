import { z } from "zod"
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  dingtalkRequest,
  resolveCredential,
  resolveDefaultWorkflowUserId,
} from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import {
  coercedNumber,
  optionalTrimmedString,
  parseParams,
} from "../../lib/schemas"
import listVisibleProcessTemplatesSkill from "../../skills/tools/list-visible-process-templates.md" with {
  type: "text",
}

const paramsSchema = z.object({
  credential_id: z.string(),
  user_id: optionalTrimmedString,
  max_results: coercedNumber.default(100),
  next_token: coercedNumber.default(0),
})

export const listVisibleProcessTemplatesTool: ToolDefinition = {
  name: "dingtalk-workflow-list-user-visible-templates",
  display_name: t("WORKFLOW_LIST_VISIBLE_TEMPLATES_TOOL_DISPLAY_NAME"),
  description: t("WORKFLOW_LIST_VISIBLE_TEMPLATES_TOOL_DESCRIPTION"),
  icon: "📚",
  skill: listVisibleProcessTemplatesSkill,
  parameters: [
    credentialParameter,
    {
      name: "user_id",
      type: "string",
      required: false,
      display_name: t("PARAM_USER_ID_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_LIST_VISIBLE_TEMPLATES_USER_ID_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "input",
        hint: t("PARAM_USER_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "max_results",
      type: "integer",
      required: false,
      default: 100,
      minimum: 1,
      maximum: 100,
      display_name: t("PARAM_MAX_RESULTS_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_LIST_VISIBLE_TEMPLATES_MAX_RESULTS_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "number-input",
        support_expression: true,
      },
    },
    {
      name: "next_token",
      type: "integer",
      required: false,
      default: 0,
      minimum: 0,
      display_name: t("PARAM_NEXT_TOKEN_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_LIST_VISIBLE_TEMPLATES_NEXT_TOKEN_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "number-input",
        support_expression: true,
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)
    const userId =
      params.user_id ?? (await resolveDefaultWorkflowUserId(credential))
    return dingtalkRequest(credential, {
      method: "GET",
      path: "/workflow/processes/userVisibilities/templates",
      query: {
        userId,
        maxResults: params.max_results,
        nextToken: params.next_token,
      },
    })
  },
}
