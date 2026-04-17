import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listMraSkill from "./list-mra-skill.md" with { type: "text" }

type ListMraResponse = {
  errcode?: number
  errmsg?: string
  mra_list?: Array<{
    id: string
    name: string
    status: number
  }>
  total_count?: number
}

export const listMraTool: ToolDefinition = {
  name: "wechat-work-list-mra",
  display_name: {
    en_US: "List MRA",
    zh_Hans: "获取MRA列表",
  },
  description: {
    en_US: "Get list of MRA (Meeting Room Connector) devices.",
    zh_Hans: "获取会议室连接器(MRA)设备列表。",
  },
  skill: listMraSkill,
  icon: "📱",
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
      name: "status",
      type: "string",
      required: false,
      display_name: {
        en_US: "Status",
        zh_Hans: "状态",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Filter by status",
          zh_Hans: "按状态筛选",
        },
        options: [
          { label: "All", value: "" },
          { label: "Online (0)", value: "0" },
          { label: "Offline (1)", value: "1" },
        ],
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      status?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
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

    const extraParams: Record<string, string> = {}
    const status = params.status?.trim()
    if (status) extraParams.status = status

    const data = await wechatWorkGetJson<ListMraResponse>(
      "/mra/list",
      token,
      extraParams,
    )
    return {
      mra_list: data.mra_list ?? [],
      total_count: data.total_count ?? 0,
    }
  },
}
