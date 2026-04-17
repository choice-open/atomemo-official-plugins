import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import removeTagMembersSkill from "./remove-tag-members-skill.md" with {
  type: "text",
}

type DelTagUsersResponse = {
  errcode?: number
  errmsg?: string
  invaliduser?: string
  invalidparty?: string
}

export const removeTagMembersTool: ToolDefinition = {
  name: "wechat-work-remove-tag-members",
  display_name: {
    en_US: "Remove tag members",
    zh_Hans: "删除标签成员",
  },
  description: {
    en_US: "Remove members from a tag in WeChat Work.",
    zh_Hans: "从企业微信标签中删除成员。",
  },
  skill: removeTagMembersSkill,
  icon: "➖",
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
      name: "tagid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Tag ID",
        zh_Hans: "标签 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Tag ID to remove members from",
          zh_Hans: "要删除成员的标签ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "users",
      type: "string",
      required: true,
      display_name: {
        en_US: "User IDs",
        zh_Hans: "成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pipe-separated userids, e.g., zhangsan|lisi",
          zh_Hans: "成员userid，多个用 | 分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "parties",
      type: "string",
      required: false,
      display_name: {
        en_US: "Department IDs",
        zh_Hans: "部门 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pipe-separated department IDs (optional)",
          zh_Hans: "部门ID，多个用 | 分隔（可选）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      tagid?: string
      users?: string
      parties?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const tagid = params.tagid?.trim()
    const users = params.users?.trim()
    if (!tagid || !users) {
      throw new Error("Tag ID and users are required.")
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

    const body: Record<string, unknown> = {}
    const tid = parseInt(tagid, 10)
    if (!Number.isNaN(tid)) body.tagid = tid

    const userList = users
      .split("|")
      .map((u) => u.trim())
      .filter(Boolean)
    if (userList.length) body.users = userList

    const parties = params.parties?.trim()
    if (parties) {
      const partyList = parties
        .split("|")
        .map((p) => parseInt(p.trim(), 10))
        .filter((p) => !Number.isNaN(p))
      if (partyList.length) body.parties = partyList
    }

    const data = await wechatWorkPostJson<DelTagUsersResponse>(
      "/tag/deltagusers",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      invaliduser: data.invaliduser ?? "",
      invalidparty: data.invalidparty ?? "",
    }
  },
}
