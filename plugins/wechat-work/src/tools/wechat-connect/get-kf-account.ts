import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import getKfAccountSkill from "./get-kf-account-skill.md" with { type: "text" }

type GetKfAccountLinkResponse = {
  errcode?: number
  errmsg?: string
  url?: string
}

export const getKfAccountTool: ToolDefinition = {
  name: "wechat-work-get-kf-account",
  display_name: {
    en_US: "Get customer service account link",
    zh_Hans: "获取客服账号链接",
  },
  description: {
    en_US:
      "Get a customer service account link with optional scene parameter.",
    zh_Hans:
      "获取带有不同参数的客服链接，微信用户点击链接即可向对应的客服账号发起咨询。",
  },
  skill: getKfAccountSkill,
  icon: "🔗",
  parameters: [
    {
      name: "wechat_work_credential",
      type: "credential_id",
      required: true,
      credential_name: "wechat-work",
      display_name: {
        en_US: "WeChat Work credential",
        zh_Hans: "企业微信凭证",
      },
      ui: { component: "credential-select" },
    },
    {
      name: "open_kfid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Customer service account ID",
        zh_Hans: "客服账号ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Customer service account ID (open_kfid)",
          zh_Hans: "客服账号ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "scene",
      type: "string",
      required: false,
      display_name: {
        en_US: "Scene",
        zh_Hans: "场景值",
      },
      ui: {
        component: "input",
        hint: {
          en_US:
            "Scene value (max 32 bytes), regex: [0-9a-zA-Z_-]*",
          zh_Hans:
            "场景值，字符串类型，由开发者自定义。不多于32字节，取值范围：[0-9a-zA-Z_-]*",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      open_kfid?: string
      scene?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }

    const openKfid = params.open_kfid?.trim()
    if (!openKfid) {
      throw new Error("open_kfid 不能为空。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const body: Record<string, unknown> = { open_kfid: openKfid }
    if (params.scene?.trim()) body.scene = params.scene.trim()

    const data = await wechatWorkPostJson<GetKfAccountLinkResponse>(
      "/kf/add_contact_way",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      url: data.url ?? "",
    }
  },
}
