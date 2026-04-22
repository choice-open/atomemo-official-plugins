// API docs: https://developers.hubspot.com/docs/api/files/files
import type {
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { hubspotLocatorListMethods } from "../_shared/methods"
import {
  credentialParams,
  folderIdParam,
} from "../_shared/parameters"
import {
  getHubSpotClient,
  getResourceLocatorValue,
  getString,
  handleHubSpotError,
  toJsonValue,
} from "../_shared/utils"

export const uploadFileTool: ToolDefinition = {
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
      type: "file_ref",
      required: true,
      display_name: t("PARAM_FILE_CONTENT_LABEL"),
      ai: { llm_description: t("PARAM_FILE_CONTENT_HINT") },
      ui: {
        hint: t("PARAM_FILE_CONTENT_HINT"),
      },
    },
    folderIdParam,
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
  locator_list: hubspotLocatorListMethods,

  async invoke({ args, context }) {
    const client = getHubSpotClient(args)
    const fileName = getString(args.parameters, "file_name")
    if (!fileName || !args.parameters.file_content)
      throw new Error("file_name and file_content are required")
    if (!context?.files) {
      throw new Error("File context is unavailable.")
    }

    const fileRef = context.files.parseFileRef(args.parameters.file_content)
    let fileContent = fileRef.content
    if (!fileContent) {
      fileContent = (await context.files.download(fileRef)).content
    }
    if (!fileContent) {
      throw new Error("Failed to read the input file content.")
    }

    const buffer = Buffer.from(fileContent, "base64")
    const folderId = getResourceLocatorValue(args.parameters, "folder_id")
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
      return toJsonValue({ success: true, result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
}
