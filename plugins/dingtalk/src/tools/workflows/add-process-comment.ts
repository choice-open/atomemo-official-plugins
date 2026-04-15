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
  process_instance_id: nonEmptyString,
  text: optionalTrimmedString,
  comment_user_id: optionalTrimmedString,
  file_json: z.unknown().optional(),
})

export const addProcessCommentTool: ToolDefinition = {
  name: "dingtalk-workflow-add-process-comment",
  display_name: t("WORKFLOW_ADD_COMMENT_TOOL_DISPLAY_NAME"),
  description: t("WORKFLOW_ADD_COMMENT_TOOL_DESCRIPTION"),
  icon: "💬",
  parameters: [
    credentialParameter,
    {
      name: "process_instance_id",
      type: "string",
      required: true,
      display_name: t("PARAM_PROCESS_INSTANCE_ID_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_ADD_COMMENT_PROCESS_INSTANCE_ID_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "text",
      type: "string",
      required: false,
      display_name: t("PARAM_TEXT_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_ADD_COMMENT_TEXT_LLM_DESCRIPTION"),
      },
      ui: {
        component: "textarea",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "comment_user_id",
      type: "string",
      required: false,
      display_name: t("PARAM_COMMENT_USER_ID_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_ADD_COMMENT_COMMENT_USER_ID_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "file_json",
      type: "string",
      required: false,
      display_name: t("PARAM_FILE_JSON_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_ADD_COMMENT_FILE_JSON_LLM_DESCRIPTION"),
      },
      ui: {
        component: "code-editor",
        hint: t("PARAM_FILE_JSON_HINT"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)
    const body: Record<string, unknown> = {
      processInstanceId: params.process_instance_id,
    }

    if (params.text) body.text = params.text
    if (params.comment_user_id) {
      body.commentUserId = params.comment_user_id
    }
    if (params.file_json) {
      body.file = parseJsonParameter(params.file_json, "file_json")
    }

    return dingtalkRequest(credential, {
      method: "POST",
      path: "/workflow/processInstances/comments",
      body,
    })
  },
}
