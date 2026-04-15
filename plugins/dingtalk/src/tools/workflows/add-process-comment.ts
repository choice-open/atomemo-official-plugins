import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  dingtalkRequest,
  resolveCredential,
  resolveOperatorUserId,
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
  file: z.unknown().nullish(),
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
        llm_description: t(
          "WORKFLOW_ADD_COMMENT_PROCESS_INSTANCE_ID_LLM_DESCRIPTION",
        ),
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
        llm_description: t(
          "WORKFLOW_ADD_COMMENT_COMMENT_USER_ID_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "input",
        hint: t("PARAM_COMMENT_USER_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "file",
      type: "file_ref",
      required: false,
      display_name: t("PARAM_FILE_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_ADD_COMMENT_FILE_LLM_DESCRIPTION"),
      },
      ui: {
        hint: t("WORKFLOW_ADD_COMMENT_FILE_HINT"),
        width: "full",
      },
    },
  ],
  async invoke({ args, context }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)
    const commentUserId =
      params.comment_user_id ?? (await resolveOperatorUserId(credential))
    const body: Record<string, unknown> = {
      processInstanceId: params.process_instance_id,
    }

    if (params.text) body.text = params.text
    body.commentUserId = commentUserId

    if (params.file != null) {
      const parsedFileRef = context.files.parseFileRef(params.file)
      const fileRefWithRemoteUrl =
        await context.files.attachRemoteUrl(parsedFileRef)
      const remoteUrl = fileRefWithRemoteUrl.remote_url?.trim()
      const mimeType = fileRefWithRemoteUrl.mime_type?.toLowerCase() ?? ""

      if (!remoteUrl) {
        throw new Error(
          "The file_ref must include or be convertible to a remote URL before it can be used as a DingTalk workflow comment image.",
        )
      }

      if (!mimeType.startsWith("image/")) {
        throw new Error(
          "DingTalk workflow comment attachments require DingDrive attachment metadata (spaceId, fileId, fileName, fileSize, fileType). This tool currently supports file_ref only for image comments that can be sent via file.photos.",
        )
      }

      body.file = {
        photos: [remoteUrl],
      }
    }

    return dingtalkRequest(credential, {
      method: "POST",
      path: "/workflow/processInstances/comments",
      body,
    })
  },
}
