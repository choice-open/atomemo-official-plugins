import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
import deleteMemberSkill from "./delete-member-skill.md" with { type: "text" }

type DeleteUserResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteMemberTool: ToolDefinition = {
  name: "wechat-work-delete-member",
  display_name: {
    en_US: "Delete member",
    zh_Hans: "删除成员",
  },
  description: {
    en_US: "Delete a member from WeChat Work organization.",
    zh_Hans: "从企业微信中删除成员。",
  },
  skill: deleteMemberSkill,
  icon: "🗑️",
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
          en_US: "The member's UserID to delete. Corresponds to the account in admin console.",
          zh_Hans: "成员UserID。对应管理端的账号",
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

    const data = await wechatWorkGetJson<DeleteUserResponse>(
      "/user/delete",
      token,
      { userid },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
