import { z } from "zod"
import type { JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { dingtalkRequest, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, parseParams } from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
  process_instance_id: nonEmptyString,
  file_id: nonEmptyString,
  with_comment_attachment: z.preprocess((v) => Boolean(v ?? false), z.boolean()),
})

export const downloadProcessAttachmentTool: ToolDefinition = {
  name: "dingtalk-workflow-download-process-attachment",
  display_name: t("WORKFLOW_DOWNLOAD_ATTACHMENT_TOOL_DISPLAY_NAME"),
  description: t("WORKFLOW_DOWNLOAD_ATTACHMENT_TOOL_DESCRIPTION"),
  icon: "📎",
  parameters: [
    credentialParameter,
    {
      name: "process_instance_id",
      type: "string",
      required: true,
      display_name: t("PARAM_PROCESS_INSTANCE_ID_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_DOWNLOAD_ATTACHMENT_PROCESS_INSTANCE_ID_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "file_id",
      type: "string",
      required: true,
      display_name: t("PARAM_FILE_ID_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_DOWNLOAD_ATTACHMENT_FILE_ID_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
        hint: t("WORKFLOW_DOWNLOAD_ATTACHMENT_FILE_ID_HINT")
      },
    },
    {
      name: "with_comment_attachment",
      type: "boolean",
      required: false,
      default: false,
      display_name: t("PARAM_WITH_COMMENT_ATTACHMENT_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_DOWNLOAD_ATTACHMENT_WITH_COMMENT_ATTACHMENT_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "switch",
        support_expression: true,
      },
    },
  ],
  async invoke({ args }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)
    return dingtalkRequest(credential, {
      method: "POST",
      path: "/workflow/processInstances/spaces/files/urls/download",
      body: {
        processInstanceId: params.process_instance_id,
        fileId: params.file_id,
        withCommentAttatchment: params.with_comment_attachment,
      },
    })
  },
}
