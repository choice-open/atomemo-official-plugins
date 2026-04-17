import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
import getMemberSkill from "./get-member-skill.md" with { type: "text" }

type GetUserResponse = Record<string, unknown> & {
  errcode?: number
  errmsg?: string
}

export const getMemberTool: ToolDefinition = {
  name: "wechat-work-get-member",
  display_name: {
    en_US: "Get member details",
    zh_Hans: "读取成员",
  },
  description: {
    en_US: "Get detailed information about a specific member in WeChat Work.",
    zh_Hans: "获取企业微信中指定成员的详细信息。",
  },
  skill: getMemberSkill,
  icon: "👤",
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
      name: "userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "User ID",
        zh_Hans: "成员UserID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The member's UserID. Corresponds to the account in admin console. Case-insensitive, 1-64 bytes.",
          zh_Hans: "成员UserID。对应管理端的账号，企业内必须唯一。不区分大小写，长度为1~64个字节",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      userid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }
    const userid = params.userid?.trim()
    if (!userid) {
      throw new Error("成员UserID 不能为空。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const data = await wechatWorkGetJson<GetUserResponse>("/user/get", token, {
      userid,
    })
    return JSON.parse(JSON.stringify(data))
  },
}
