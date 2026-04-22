// API docs: https://developers.hubspot.com/docs/api/files/files
import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { hubspotLocatorListMethods } from "../_shared/methods"
import {
  credentialParams,
  fileIdParam,
} from "../_shared/parameters"
import type { ToolArgs } from "../_shared/types"
import {
  getHubSpotClient,
  getResourceLocatorValue,
  handleHubSpotError,
  toJsonValue,
} from "../_shared/utils"

export const getFilePublicUrlTool = {
  name: "hubspot-get-file-public-url",
  display_name: t("GET_FILE_PUBLIC_URL_DISPLAY_NAME"),
  description: t("GET_FILE_PUBLIC_URL_DESCRIPTION"),
  icon: "🔗",
  skill: "",
  parameters: [...credentialParams, fileIdParam],
  locator_list: hubspotLocatorListMethods,

  async invoke({ args }: { args: ToolArgs }): Promise<JsonValue> {
    const client = getHubSpotClient(args)
    const fileId = getResourceLocatorValue(args.parameters, "file_id")
    if (!fileId) throw new Error("file_id is required")

    try {
      const result = await client.files.filesApi.getById(fileId)
      return toJsonValue({ success: true, result })
    } catch (error) {
      handleHubSpotError(error)
    }
  },
} satisfies ToolDefinition
