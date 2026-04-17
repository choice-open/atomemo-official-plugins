import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import batchDeleteMembersSkill from "./batch-delete-members-skill.md" with { type: "text" }

type BatchDeleteMembersResponse = {
  errcode?: number
  errmsg?: string
  invaliduser?: string
  invalidparty?: string
}

export const batchDeleteMembersTool: ToolDefinition = {
  name: "wechat-work-batch-delete-members",
  display_name: {
    en_US: "Batch delete members",
    zh_Hans: "批量删除成员",
  },
  description: {
    en_US: "Batch delete members from WeChat Work organization.",
    zh_Hans: "批量从企业微信中删除成员。",
  },
  skill: batchDeleteMembersSkill,
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
      name: "userid_list",
      type: "string",
      required: true,
      display_name: {
        en_US: "User ID list (JSON array)",
        zh_Hans: "成员 userid 列表 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of userids to delete, e.g. [\"zhangsan\",\"lisi\"]",
          zh_Hans: "要删除的成员 userid JSON数组，例如 [\"zhangsan\",\"lisi\"]",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "party_id_list",
      type: "string",
      required: false,
      display_name: {
        en_US: "Department ID list (JSON array)",
        zh_Hans: "部门 ID 列表 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of department IDs to delete (members under these departments will also be deleted)",
          zh_Hans: "要删除的部门 ID JSON数组，部门下的成员也会被删除",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      userid_list?: string
      party_id_list?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const useridListStr = params.userid_list?.trim()
    if (!useridListStr) {
      throw new Error("userid_list is required.")
    }

    let useridList: string[] = []
    try {
      useridList = JSON.parse(useridListStr)
      if (!Array.isArray(useridList)) {
        throw new Error("userid_list must be a JSON array.")
      }
    } catch {
      throw new Error("userid_list must be a valid JSON array.")
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

    const body: Record<string, unknown> = { useridlist: useridList }

    const partyIdListStr = params.party_id_list?.trim()
    if (partyIdListStr) {
      try {
        const partyIdList = JSON.parse(partyIdListStr)
        if (Array.isArray(partyIdList)) {
          body.partyidlist = partyIdList
        }
      } catch {
        // ignore invalid party_id_list
      }
    }

    const data = await wechatWorkPostJson<BatchDeleteMembersResponse>(
      "/user/batchdelete",
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