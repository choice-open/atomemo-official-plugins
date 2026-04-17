import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
import getExternalContactSkill from "./get-external-contact-skill.md" with {
  type: "text",
}

type GetExternalContactResponse = {
  errcode?: number
  errmsg?: string
  external_contact?: {
    external_userid: string
    name: string
    type: number
    gender: number
    avatar?: string
    corp_name?: string
    corp_full_name?: string
    position?: string
    unionid?: string
  }
  follow_user?: Array<{
    userid: string
    remark?: string
    description?: string
    createtime: number
    tags?: Array<{
      group_name: string
      tag_name: string
      tag_id?: string
      type: number
    }>
    remark_corp_name?: string
    remark_mobiles?: string[]
    oper_userid?: string
    add_way?: number
    state?: string
  }>
  next_cursor?: string
}

export const getExternalContactTool: ToolDefinition = {
  name: "wechat-work-get-external-contact",
  display_name: {
    en_US: "Get external contact details",
    zh_Hans: "获取客户详情",
  },
  description: {
    en_US: "Get detailed information of an external contact by external_userid.",
    zh_Hans: "企业可通过此接口，根据外部联系人的userid，拉取客户详情。",
  },
  skill: getExternalContactSkill,
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
      name: "external_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "External user ID",
        zh_Hans: "外部联系人的userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The userid of the external contact, not the enterprise member's account",
          zh_Hans: "外部联系人的userid，注意不是企业成员的账号",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "cursor",
      type: "string",
      required: false,
      display_name: {
        en_US: "Cursor",
        zh_Hans: "分页游标",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Cursor from previous response (next_cursor), needed when follow_user exceeds 500",
          zh_Hans: "上次请求返回的next_cursor，当跟进人超过500人时需要使用",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      external_userid?: string
      cursor?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }
    const externalUserid = params.external_userid?.trim()
    if (!externalUserid) {
      throw new Error("external_userid 不能为空。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const query: Record<string, string> = { external_userid: externalUserid }
    const cursor = params.cursor?.trim()
    if (cursor) query.cursor = cursor

    const data = await wechatWorkGetJson<GetExternalContactResponse>(
      "/externalcontact/get",
      token,
      query,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      external_contact: data.external_contact ?? null,
      follow_user: data.follow_user ?? [],
      next_cursor: data.next_cursor ?? "",
    }
  },
}
