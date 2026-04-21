// API docs: https://developers.hubspot.com/docs/api/files/files
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { credentialParams } from "../_shared/parameters"
import type { ToolArgs } from "../_shared/types"
import {
  getHubSpotClient,
  getString,
  handleHubSpotError,
} from "../_shared/utils"

export const uploadFileTool = {
  name: "hubspot-upload-file",
  display_name: t("UPLOAD_FILE_DISPLAY_NAME"),
  description: t("UPLOAD_FILE_DESCRIPTION"),
  icon: "📤",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "file_name",
      type: "string",
      required: true,
      display_name: t("PARAM_FILE_NAME_LABEL"),
      ai: { llm_description: t("PARAM_FILE_NAME_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_FILE_NAME_HINT"),
        placeholder: t("PARAM_FILE_NAME_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "file_content",
      type: "string",
      required: true,
      display_name: t("PARAM_FILE_CONTENT_LABEL"),
      ai: { llm_description: t("PARAM_FILE_CONTENT_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_FILE_CONTENT_HINT"),
        support_expression: true,
      },
    },
    {
      name: "folder_id",
      type: "string",
      required: false,
      display_name: t("PARAM_FILE_FOLDER_ID_LABEL"),
      ai: { llm_description: t("PARAM_FILE_FOLDER_ID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_FILE_FOLDER_ID_HINT"),
        support_expression: true,
      },
    },
    {
      name: "access",
      type: "string",
      required: false,
      display_name: t("PARAM_FILE_ACCESS_LABEL"),
      ai: { llm_description: t("PARAM_FILE_ACCESS_HINT") },
      ui: {
        component: "select",
        hint: t("PARAM_FILE_ACCESS_HINT"),
        options: [
          { label: t("OPTION_PRIVATE"), value: "PRIVATE" },
          { label: t("OPTION_PUBLIC_INDEXABLE"), value: "PUBLIC_INDEXABLE" },
          {
            label: t("OPTION_PUBLIC_NOT_INDEXABLE"),
            value: "PUBLIC_NOT_INDEXABLE",
          },
        ],
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const fileName = getString(args.parameters, "file_name")
    const fileContent = getString(args.parameters, "file_content")
    if (!fileName || !fileContent)
      throw new Error("file_name and file_content are required")

    const buffer = Buffer.from(fileContent, "base64")
    const folderId = getString(args.parameters, "folder_id")
    const access = getString(args.parameters, "access")

    try {
      const fileBlob = new Blob([buffer])
      const result = await client.files.filesApi.upload(
        {
          data: fileBlob as any,
          name: fileName,
        },
        folderId,
        undefined,
        fileName,
        undefined,
        JSON.stringify({
          access: access ?? "PRIVATE",
          ttl: undefined,
          overwrite: false,
          duplicateValidationStrategy: "NONE",
          duplicateValidationScope: "ENTIRE_PORTAL",
        }),
      )
      return { success: true, result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
