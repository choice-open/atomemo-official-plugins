import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import {
  parseImDownloadFileBody,
  parseImDownloadFileQuery,
} from "./zod/im-download-file.zod"

import im_download_fileSkill from "./im-download-file-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "im_download_file",
  legacy_id: "f029",
  module: "im",
  name: "下载文件",
  method: "GET",
  path: "/open-apis/im/v1/files/{file_key}",
}

export const feishuImDownloadFileTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
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
    {
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: t("QUERY_PARAMS"),
      ui: {
        component: "input",
        hint: t("QUERY_PARAMS_HINT"),
        placeholder: { en_US: '{"page_size":20}', zh_Hans: '{"page_size":20}' },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"query_params_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {
      file_key: readRequiredStringParam(p, "file_key"),
    }
    const queryRaw = parseOptionalJsonObject(
      p.query_params_json,
      "query_params_json",
    )
    const query = parseImDownloadFileQuery(queryRaw)
    const body = parseImDownloadFileBody({})
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: query,
      body,
    })
  },
}
