import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import updateCorpTagSkill from "./update-corp-tag-skill.md" with { type: "text" }

type UpdateCorpTagResponse = {
  errcode?: number
  errmsg?: string
}

export const updateCorpTagTool: ToolDefinition = {
  name: "wechat-work-update-corp-tag",
  display_name: {
    en_US: "Edit enterprise customer tag",
    zh_Hans: "编辑企业客户标签",
  },
  description: {
    en_US: "Edit the name or order of an enterprise customer tag or tag group.",
    zh_Hans: "企业可通过此接口编辑客户标签/标签组的名称或次序值。",
  },
  skill: updateCorpTagSkill,
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
      name: "id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Tag or tag group ID",
        zh_Hans: "标签或标签组的id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The ID of the tag or tag group to edit",
          zh_Hans: "标签或标签组的id",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "name",
      type: "string",
      required: false,
      display_name: {
        en_US: "New name",
        zh_Hans: "新的标签或标签组名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New tag or tag group name, max 30 characters",
          zh_Hans: "新的标签或标签组名称，最长为30个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "order",
      type: "integer",
      required: false,
      display_name: {
        en_US: "Order",
        zh_Hans: "次序值",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "Tag/tag group order. Higher values sort first. Valid range: [0, 2^32)",
          zh_Hans: "标签/标签组的次序值。order值大的排序靠前。有效的值范围是[0, 2^32)",
        },
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      id?: string
      name?: string
      order?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }

    const id = params.id?.trim()
    if (!id) {
      throw new Error("id 不能为空。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const body: Record<string, unknown> = { id }

    const name = params.name?.trim()
    if (name) body.name = name

    if (typeof params.order === "number") body.order = params.order

    const data = await wechatWorkPostJson<UpdateCorpTagResponse>(
      "/externalcontact/edit_corp_tag",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
