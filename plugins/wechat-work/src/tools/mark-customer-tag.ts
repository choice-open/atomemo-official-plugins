import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import markCustomerTagSkill from "./mark-customer-tag-skill.md" with { type: "text" }

type MarkCustomerTagResponse = {
  errcode?: number
  errmsg?: string
}

export const markCustomerTagTool: ToolDefinition = {
  name: "wechat-work-mark-customer-tag",
  display_name: {
    en_US: "Mark customer tag",
    zh_Hans: "给客户打标签",
  },
  description: {
    en_US: "Add or remove tags from an external contact.",
    zh_Hans: "给外部联系人添加或删除标签。",
  },
  skill: markCustomerTagSkill,
  icon: "🏷️",
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
      name: "add_tag_ids",
      type: "string",
      required: false,
      display_name: {
        en_US: "Add tag IDs (JSON array)",
        zh_Hans: "添加的标签ID (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of tag IDs to add, e.g. [\"TAGID1\",\"TAGID2\"]",
          zh_Hans: "要添加的标签ID JSON数组",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "remove_tag_ids",
      type: "string",
      required: false,
      display_name: {
        en_US: "Remove tag IDs (JSON array)",
        zh_Hans: "移除的标签ID (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of tag IDs to remove, e.g. [\"TAGID1\",\"TAGID2\"]",
          zh_Hans: "要移除的标签ID JSON数组",
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
      add_tag_ids?: string
      remove_tag_ids?: string
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

    const addTagIdsStr = params.add_tag_ids?.trim()
    if (addTagIdsStr) {
      try {
        const addTagIds = JSON.parse(addTagIdsStr)
        if (Array.isArray(addTagIds)) {
          body.add_tag_ids = addTagIds
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const removeTagIdsStr = params.remove_tag_ids?.trim()
    if (removeTagIdsStr) {
      try {
        const removeTagIds = JSON.parse(removeTagIdsStr)
        if (Array.isArray(removeTagIds)) {
          body.remove_tag_ids = removeTagIds
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const data = await wechatWorkPostJson<MarkCustomerTagResponse>(
      "/externalcontact/mark_tag",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "op" }
  },
}