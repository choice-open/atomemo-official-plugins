import { z } from "zod"
import type { FileRef, JsonValue, ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  dingtalkRequest,
  downloadBinary,
  guessExtension,
  resolveCredential,
} from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { nonEmptyString, parseParams } from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
  robot_code: nonEmptyString,
  download_code: nonEmptyString,
})

export const downloadRobotMessageFileTool: ToolDefinition = {
  name: "dingtalk-robot-download-message-file",
  display_name: t("ROBOT_DOWNLOAD_FILE_TOOL_DISPLAY_NAME"),
  description: t("ROBOT_DOWNLOAD_FILE_TOOL_DESCRIPTION"),
  icon: "📥",
  parameters: [
    credentialParameter,
    {
      name: "robot_code",
      type: "string",
      required: true,
      display_name: t("PARAM_ROBOT_CODE_LABEL"),
      ai: {
        llm_description: t("ROBOT_DOWNLOAD_FILE_ROBOT_CODE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "download_code",
      type: "string",
      required: true,
      display_name: t("PARAM_DOWNLOAD_CODE_LABEL"),
      ai: {
        llm_description: t("ROBOT_DOWNLOAD_FILE_DOWNLOAD_CODE_LLM_DESCRIPTION"),
      },
      ui: {
        component: "input",
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args, context }): Promise<JsonValue> {
    const params = parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)
    const response = await dingtalkRequest<Record<string, unknown>>(credential, {
      method: "POST",
      path: "/robot/messageFiles/download",
      body: {
        robotCode: params.robot_code,
        downloadCode: params.download_code,
      },
    })

    const result = (response.result ?? response) as Record<string, unknown>
    const downloadUrl = String(result.downloadUrl ?? response.downloadUrl ?? "")
    if (!downloadUrl) {
      throw new Error("DingTalk did not return a downloadUrl for the robot file.")
    }

    const downloaded = await downloadBinary(downloadUrl)
    const fileRef: FileRef = {
      __type__: "file_ref",
      source: "mem",
      filename: downloaded.filename,
      extension: guessExtension(downloaded.filename, downloaded.mimeType),
      mime_type: downloaded.mimeType,
      size: downloaded.size,
      content: downloaded.content,
      res_key: null,
      remote_url: null,
    }

    return context.files.upload(fileRef, {})
  },
}
