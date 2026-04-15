import type {
  Property,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { invokeFeishuOpenApi, readRequiredStringParam } from "../feishu/request"
import type { FeishuApiFunction } from "../feishu-api-functions"
import { parseImEmptyQuery } from "./im.zod"
import im_download_imageSkill from "./im-download-image-skill.md" with {
  type: "text",
}

const fn: FeishuApiFunction = {
  id: "im_download_image",
  module: "im",
  name: "下载图片",
  method: "GET",
  path: "/open-apis/im/v1/images/{image_key}",
}

export const feishuImDownloadImageTool: ToolDefinition = {
  name: `feishu-${fn.id}`,
  display_name: {
    en_US: "Download image",
    zh_Hans: "下载图片",
  },
  description: {
    en_US: "This API is used to download an image by image key.",
    zh_Hans: "本接口用于通过图片的 Key 值下载图片。",
  },
  skill: im_download_imageSkill,
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
      name: "image_key",
      type: "string",
      required: true,
      display_name: t("IMAGE_KEY"),
      ui: {
        component: "input",
        hint: t("IMAGE_KEY_HINT"),
        support_expression: true,
        width: "full",
      },
    } satisfies Property<"image_key">,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const pathParams = {
      image_key: readRequiredStringParam(p, "image_key"),
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
