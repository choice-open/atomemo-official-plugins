import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import setAgentSkill from "./set-agent-skill.md" with { type: "text" }

type SetAgentResponse = {
  errcode?: number
  errmsg?: string
}

export const setAgentTool: ToolDefinition = {
  name: "wechat-work-set-agent",
  display_name: {
    en_US: "Set application",
    zh_Hans: "设置应用",
  },
  description: {
    en_US: "Set or update a WeChat Work application.",
    zh_Hans: "设置或更新企业微信自建应用。",
  },
  skill: setAgentSkill,
  icon: "⚙️",
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
      name: "agent_id",
      type: "integer",
      required: true,
      display_name: {
        en_US: "Agent ID",
        zh_Hans: "应用 AgentId",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "The numeric agent id of your self-built app",
          zh_Hans: "自建应用的 AgentId",
        },
      },
    },
    {
      name: "name",
      type: "string",
      required: false,
      display_name: {
        en_US: "Application name",
        zh_Hans: "应用名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Application name (max 64 characters)",
          zh_Hans: "应用名称，最多64个字符",
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
        zh_Hans: "应用描述",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Application description (max 500 characters)",
          zh_Hans: "应用描述，最多500个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "logo_media_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Logo media ID",
        zh_Hans: "Logo media_id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Media ID of the logo image (upload via media/upload first)",
          zh_Hans: "应用-logo的media_id，需先通过素材上传接口上传",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "redirect_domain",
      type: "string",
      required: false,
      display_name: {
        en_US: "OAuth2 redirect domain",
        zh_Hans: "OAuth2授权域名",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "OAuth2 redirect domain",
          zh_Hans: "OAuth2回调授权域名",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "home_url",
      type: "string",
      required: false,
      display_name: {
        en_US: "Homepage URL",
        zh_Hans: "应用主页",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Application homepage URL",
          zh_Hans: "应用主页URL",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "isreportenter",
      type: "string",
      required: false,
      display_name: {
        en_US: "Report user enter",
        zh_Hans: "是否上报用户进入",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Whether to report user entering the app",
          zh_Hans: "是否上报用户进入应用",
        },
        options: [
          { label: "Yes", value: "1" },
          { label: "No", value: "0" },
        ],
      },
    },
    {
      name: "report_location",
      type: "string",
      required: false,
      display_name: {
        en_US: "Report location",
        zh_Hans: "是否上报地理位置",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Whether to report user location",
          zh_Hans: "是否上报用户地理位置",
        },
        options: [
          { label: "Yes", value: "1" },
          { label: "No", value: "0" },
        ],
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      agent_id?: number
      name?: string
      description?: string
      logo_media_id?: string
      redirect_domain?: string
      home_url?: string
      isreportenter?: string
      report_location?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    if (
      typeof params.agent_id !== "number" ||
      !Number.isFinite(params.agent_id)
    ) {
      throw new Error("agent_id must be a valid integer.")
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

    const body: Record<string, unknown> = { agentid: params.agent_id }

    const name = params.name?.trim()
    if (name) body.name = name

    const description = params.description?.trim()
    if (description) body.description = description

    const logoMediaId = params.logo_media_id?.trim()
    if (logoMediaId) body.logo_media_id = logoMediaId

    const redirectDomain = params.redirect_domain?.trim()
    if (redirectDomain) body.redirect_domain = redirectDomain

    const homeUrl = params.home_url?.trim()
    if (homeUrl) body.home_url = homeUrl

    const isreportenter = params.isreportenter?.trim()
    if (isreportenter) body.isreportenter = parseInt(isreportenter, 10)

    const reportLocation = params.report_location?.trim()
    if (reportLocation) body.report_location = parseInt(reportLocation, 10)

    const data = await wechatWorkPostJson<SetAgentResponse>(
      "/agent/set",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}