import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import updateExternalContactRemarkSkill from "./update-external-contact-remark-skill.md" with { type: "text" }

type UpdateExternalContactRemarkResponse = {
  errcode?: number
  errmsg?: string
}

export const updateExternalContactRemarkTool: ToolDefinition = {
  name: "wechat-work-update-external-contact-remark",
  display_name: {
    en_US: "Update external contact remark",
    zh_Hans: "修改客户备注信息",
  },
  description: {
    en_US: "Update the remark of an external contact.",
    zh_Hans: "修改外部联系人的备注信息。",
  },
  skill: updateExternalContactRemarkSkill,
  icon: "✏️",
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
        en_US: "User ID (Staff)",
        zh_Hans: "成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Userid of the staff who added the external contact",
          zh_Hans: "添加了该外部联系人的成员userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "external_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "External user ID",
        zh_Hans: "外部联系人 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "External contact's userid",
          zh_Hans: "外部联系人的 userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "remark",
      type: "string",
      required: false,
      display_name: {
        en_US: "Remark",
        zh_Hans: "备注",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New remark for the external contact (max 500 characters)",
          zh_Hans: "外部联系人的新备注名，最多500个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "description",
      type: "string",
      required: false,
      display_name: {
        en_US: "Description",
        zh_Hans: "描述",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Description of the external contact (max 500 characters)",
          zh_Hans: "外部联系人描述，最多500个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "remark_corp_name",
      type: "string",
      required: false,
      display_name: {
        en_US: "Corp name",
        zh_Hans: "公司名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Company name of the external contact",
          zh_Hans: "外部联系人所在公司名称",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "remark_corp_full_name",
      type: "string",
      required: false,
      display_name: {
        en_US: "Full corp name",
        zh_Hans: "公司全称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Full company name of the external contact",
          zh_Hans: "外部联系人所在公司全称",
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
      external_userid?: string
      remark?: string
      description?: string
      remark_corp_name?: string
      remark_corp_full_name?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const userid = params.userid?.trim()
    if (!userid) {
      throw new Error("User ID is required.")
    }

    const externalUserid = params.external_userid?.trim()
    if (!externalUserid) {
      throw new Error("External user ID is required.")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error(
        "Wechat work credential is missing or has no access_token.",
      )
    }

    const body: Record<string, unknown> = {
      userid,
      external_userid: externalUserid,
    }

    const remark = params.remark?.trim()
    if (remark) body.remark = remark

    const description = params.description?.trim()
    if (description) body.description = description

    const remarkCorpName = params.remark_corp_name?.trim()
    if (remarkCorpName) body.remark_corp_name = remarkCorpName

    const remarkCorpFullName = params.remark_corp_full_name?.trim()
    if (remarkCorpFullName) body.remark_corp_full_name = remarkCorpFullName

    const data = await wechatWorkPostJson<UpdateExternalContactRemarkResponse>(
      "/externalcontact/remark",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}