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

const taskIdSchema = z.preprocess(
  (value) => (value == null || value === "" ? undefined : Number(value)),
  z.number().int().positive(),
)

const paramsSchema = z.object({
  credential_id: z.string(),
  process_instance_id: nonEmptyString,
  task_id: taskIdSchema,
  actioner_user_id: optionalTrimmedString,
  result: z.enum(["agree", "refuse"]),
  remark: optionalTrimmedString,
  file: z.unknown().nullish(),
})

export const executeProcessTaskTool: ToolDefinition = {
  name: "dingtalk-workflow-execute-process-task",
  display_name: t("WORKFLOW_EXECUTE_TASK_TOOL_DISPLAY_NAME"),
  description: t("WORKFLOW_EXECUTE_TASK_TOOL_DESCRIPTION"),
  icon: "✅",
  parameters: [
    credentialParameter,
    {
      name: "process_instance_id",
      type: "string",
      required: true,
      display_name: t("PARAM_PROCESS_INSTANCE_ID_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_EXECUTE_TASK_PROCESS_INSTANCE_ID_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "task_id",
      type: "integer",
      required: true,
      minimum: 1,
      display_name: t("PARAM_TASK_ID_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_EXECUTE_TASK_TASK_ID_LLM_DESCRIPTION"),
      },
      ui: {
        component: "number-input",
        support_expression: true,
      },
    },
    {
      name: "actioner_user_id",
      type: "string",
      required: false,
      display_name: t("PARAM_ACTIONER_USER_ID_LABEL"),
      ai: {
        llm_description: t(
          "WORKFLOW_EXECUTE_TASK_ACTIONER_USER_ID_LLM_DESCRIPTION",
        ),
      },
      ui: {
        component: "input",
        hint: t("PARAM_ACTIONER_USER_ID_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "result",
      type: "string",
      required: true,
      display_name: t("PARAM_ACTION_RESULT_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_EXECUTE_TASK_RESULT_LLM_DESCRIPTION"),
      },
      enum: ["agree", "refuse"],
      ui: {
        component: "select",
        hint: t("PARAM_ACTION_RESULT_HINT"),
        options: [
          { value: "agree", label: t("OPTION_ACTION_RESULT_AGREE") },
          { value: "refuse", label: t("OPTION_ACTION_RESULT_REFUSE") },
        ],
      },
    },
    {
      name: "remark",
      type: "string",
      required: false,
      display_name: t("PARAM_REMARK_LABEL"),
      ai: {
        llm_description: t("WORKFLOW_EXECUTE_TASK_REMARK_LLM_DESCRIPTION"),
      },
      ui: {
        component: "textarea",
        hint: t("WORKFLOW_EXECUTE_TASK_REMARK_HINT"),
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
        llm_description: t("WORKFLOW_EXECUTE_TASK_FILE_LLM_DESCRIPTION"),
      },
      ui: {
        hint: t("WORKFLOW_EXECUTE_TASK_FILE_HINT"),
        width: "full",
      },
    },
  ],
  async invoke({ args, context }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)
    const actionerUserId =
      params.actioner_user_id ?? (await resolveOperatorUserId(credential))
    const body: Record<string, unknown> = {
      processInstanceId: params.process_instance_id,
      taskId: params.task_id,
      actionerUserId,
      result: params.result,
    }

    if (params.remark) {
      body.remark = params.remark
    }

    if (params.file != null) {
      const parsedFileRef = context.files.parseFileRef(params.file)
      const fileRefWithRemoteUrl =
        await context.files.attachRemoteUrl(parsedFileRef)
      const remoteUrl = fileRefWithRemoteUrl.remote_url?.trim()
      const mimeType = fileRefWithRemoteUrl.mime_type?.toLowerCase() ?? ""

      if (!remoteUrl) {
        throw new Error(
          "The file_ref must include or be convertible to a remote URL before it can be used as a DingTalk workflow task attachment.",
        )
      }

      if (!mimeType.startsWith("image/")) {
        throw new Error(
          "DingTalk workflow task attachments require DingDrive attachment metadata (spaceId, fileId, fileName, fileSize, fileType). This tool currently supports file_ref only for image attachments that can be sent via file.photos.",
        )
      }

      body.file = {
        photos: [remoteUrl],
      }
    }

    return dingtalkRequest(credential, {
      method: "POST",
      path: "/workflow/processInstances/execute",
      body,
    })
  },
}
