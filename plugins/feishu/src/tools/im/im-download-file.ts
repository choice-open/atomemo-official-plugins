import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { invokeFeishuOpenApi, readRequiredStringParam } from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import { parseImEmptyQuery } from "./im.zod"
import im_download_fileSkill from "./im-download-file-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "im_download_file",
  module: "im",
  name: "下载文件",
  method: "GET",
  path: "/open-apis/im/v1/files/{file_key}",
}

export const feishuImDownloadFileTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Download file",
    zh_Hans: "下载文件",
  },
  description: {
    en_US: "This API is used to download a file by file key.",
    zh_Hans: "本接口用于通过文件的 Key 下载文件。",
  },
  skill: im_download_fileSkill,
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: t("CREDENTIAL"),
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "file_key",
      type: "string",
      required: true,
      display_name: t("FILE_KEY"),
      ui: {
        component: "input",
        hint: t("FILE_KEY_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"file_key">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {
      file_key: readRequiredStringParam(p, "file_key"),
    }
    const queryParams = parseImEmptyQuery({})
    const body = {}
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams,
      body,
    })
  },
}
