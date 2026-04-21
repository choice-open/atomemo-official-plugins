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

export const getFilePublicUrlTool = {
  name: "hubspot-get-file-public-url",
  display_name: t("GET_FILE_PUBLIC_URL_DISPLAY_NAME"),
  description: t("GET_FILE_PUBLIC_URL_DESCRIPTION"),
  icon: "🔗",
  skill: "",
  parameters: [
    ...credentialParams,
    {
      name: "file_id",
      type: "string",
      required: true,
      display_name: t("PARAM_FILE_ID_LABEL"),
      ai: { llm_description: t("PARAM_FILE_ID_HINT") },
      ui: {
        component: "input",
        hint: t("PARAM_FILE_ID_HINT"),
        placeholder: t("PARAM_FILE_ID_PLACEHOLDER"),
        support_expression: true,
      },
    },
  ],

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const fileId = getString(args.parameters, "file_id")
    if (!fileId) throw new Error("file_id is required")

    try {
      const result = await client.files.filesApi.getById(fileId)
      return { success: true, result } as unknown as JsonValue
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
