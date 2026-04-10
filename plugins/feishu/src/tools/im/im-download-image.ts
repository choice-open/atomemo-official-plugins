import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  invokeFeishuOpenApi,
  parseOptionalJsonObject,
  readRequiredStringParam,
} from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import {
  parseImDownloadImageBody,
  parseImDownloadImageQuery,
} from "./zod/im-download-image.zod"

import im_download_imageSkill from "./im-download-image-skill.md" with { type: "text" }

const fn: FeishuApiFunction = {
  id: "im_download_image",
  legacy_id: "f027",
  module: "im",
  name: "下载图片",
  method: "GET",
  path: "/open-apis/im/v1/images/{image_key}",
}

export const feishuImDownloadImageTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: `[${fn.module}] ${fn.name}`,
    zh_Hans: `[${fn.module}] ${fn.name}`,
  },
  description: {
    en_US: `${fn.method} ${fn.path} (${fn.id}, legacy: ${fn.legacy_id})`,
    zh_Hans: `${fn.method} ${fn.path}（${fn.id}，兼容: ${fn.legacy_id}）`,
  },
  skill: im_download_imageSkill,
  icon: "🪶",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "feishu-app-credential",
      display_name: { en_US: "Credential", zh_Hans: "凭证" },
      ui: { component: "credential-select" },
    } satisfies Property<"credential_id">,
    {
      name: "image_key",
      type: "string",
      required: true,
      display_name: { en_US: "image_key", zh_Hans: "image_key" },
      ui: {
        component: "input",
        hint: {
          en_US: "URL path parameter: image_key",
          zh_Hans: "URL 路径参数：image_key",
        },
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"image_key">,
    {
      name: "query_params_json",
      type: "string",
      required: false,
      display_name: {
        en_US: "Query Params",
        zh_Hans: "查询参数",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "HTTP query object as JSON string (optional)",
          zh_Hans: "HTTP 查询参数，JSON 对象字符串（可选）",
        },
        placeholder: {
          en_US: '{"page_size":20}',
          zh_Hans: '{"page_size":20}',
        },
        width: "full",
        support_expression: true,
      },
    } satisfies Property<"query_params_json">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {
      image_key: readRequiredStringParam(p, "image_key"),
    }
    const queryRaw = parseOptionalJsonObject(p.query_params_json, "query_params_json")
    const query = parseImDownloadImageQuery(queryRaw)
    const body = parseImDownloadImageBody({})
    return invokeFeishuOpenApi(fn, {
      credentials: args.credentials,
      credentialId,
      pathParams,
      queryParams: query,
      body,
    })
  },
}
