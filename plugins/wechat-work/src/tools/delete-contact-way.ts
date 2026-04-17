import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import deleteContactWaySkill from "./delete-contact-way-skill.md" with { type: "text" }

type DeleteContactWayResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteContactWayTool: ToolDefinition = {
  name: "wechat-work-delete-contact-way",
  display_name: {
    en_US: "Delete contact way",
    zh_Hans: "删除联系我方式",
  },
  description: {
    en_US: "Delete a contact way configuration.",
    zh_Hans: "删除联系我方式的配置。",
  },
  skill: deleteContactWaySkill,
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
      name: "config_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Config ID",
        zh_Hans: "联系方式配置ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Contact way config ID to delete",
          zh_Hans: "要删除的联系方式 config_id",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      config_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const configId = params.config_id?.trim()
    if (!configId) {
      throw new Error("config_id is required.")
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

    const data = await wechatWorkPostJson<DeleteContactWayResponse>(
      "/externalcontact/del_contact_way",
      token,
      { config_id: configId },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}