import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createWebinarSkill from "./create-webinar-skill.md" with { type: "text" }

type CreateWebinarResponse = {
  errcode?: number
  errmsg?: string
  meetingid?: string
}

export const createWebinarTool: ToolDefinition = {
  name: "wechat-work-create-webinar",
  display_name: {
    en_US: "Create webinar",
    zh_Hans: "创建研讨会",
  },
  description: {
    en_US: "Create a new webinar (webinar).",
    zh_Hans: "创建网络研讨会。",
  },
  skill: createWebinarSkill,
  icon: "🎤",
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
      name: "admin_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Admin user ID",
        zh_Hans: "研讨会管理员userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Webinar admin user ID",
          zh_Hans: "研讨会管理员的userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "title",
      type: "string",
      required: true,
      display_name: {
        en_US: "Title",
        zh_Hans: "研讨会主题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Webinar title (max 255 characters)",
          zh_Hans: "研讨会主题，最多255个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "admission_type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Admission type",
        zh_Hans: "观众观看限制类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Webinar admission type",
          zh_Hans: "观众观看限制类型",
        },
        options: [
          { label: { en_US: "Public (0)", zh_Hans: "公开 (0)" }, value: "0" },
          { label: { en_US: "Registration required (1)", zh_Hans: "报名 (1)" }, value: "1" },
          { label: { en_US: "Password required (2)", zh_Hans: "密码 (2)" }, value: "2" },
        ],
      },
    },
    {
      name: "start_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Start time as Unix timestamp",
          zh_Hans: "开始时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "End time as Unix timestamp",
          zh_Hans: "结束时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "hosts",
      type: "string",
      required: false,
      display_name: {
        en_US: "Hosts (JSON array)",
        zh_Hans: "主持人 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of host userids, e.g. [{\"userid\": \"xxx\"}]",
          zh_Hans: "主持人userid的JSON数组，如 [{\"userid\": \"xxx\"}]",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "sponsor",
      type: "string",
      required: false,
      display_name: {
        en_US: "Sponsor",
        zh_Hans: "主办方",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Webinar sponsor",
          zh_Hans: "主办方名称",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "cover_url",
      type: "string",
      required: false,
      display_name: {
        en_US: "Cover picture URL",
        zh_Hans: "封面图片URL",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Cover picture URL",
          zh_Hans: "封面图片URL",
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
        zh_Hans: "研讨会描述",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Webinar description",
          zh_Hans: "研讨会描述",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "password",
      type: "string",
      required: false,
      display_name: {
        en_US: "Password",
        zh_Hans: "会议密码",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Webinar password",
          zh_Hans: "会议密码",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "max_participants",
      type: "string",
      required: false,
      display_name: {
        en_US: "Max participants",
        zh_Hans: "最大参会人数",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Maximum number of participants",
          zh_Hans: "最大参会人数",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      admin_userid?: string
      title?: string
      admission_type?: string
      start_time?: string
      end_time?: string
      hosts?: string
      sponsor?: string
      cover_url?: string
      description?: string
      password?: string
      max_participants?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const adminUserid = params.admin_userid?.trim()
    if (!adminUserid) {
      throw new Error("admin_userid is required.")
    }

    const title = params.title?.trim()
    if (!title) {
      throw new Error("title is required.")
    }

    const admissionType = params.admission_type?.trim()
    if (!admissionType) {
      throw new Error("admission_type is required.")
    }

    const startTime = params.start_time?.trim()
    if (!startTime) {
      throw new Error("start_time is required.")
    }

    const endTime = params.end_time?.trim()
    if (!endTime) {
      throw new Error("end_time is required.")
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
      admin_userid: adminUserid,
      title,
      admission_type: parseInt(admissionType, 10),
      start_time: parseInt(startTime, 10),
      end_time: parseInt(endTime, 10),
    }

    const hostsStr = params.hosts?.trim()
    if (hostsStr) {
      try {
        const hosts = JSON.parse(hostsStr)
        if (Array.isArray(hosts)) {
          body.hosts = hosts
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const sponsor = params.sponsor?.trim()
    if (sponsor) body.sponsor = sponsor

    const coverUrl = params.cover_url?.trim()
    if (coverUrl) body.cover_url = coverUrl

    const description = params.description?.trim()
    if (description) body.description = description

    const password = params.password?.trim()
    if (password) body.password = password

    const maxParticipants = params.max_participants?.trim()
    if (maxParticipants) body.max_participants = parseInt(maxParticipants, 10)

    const data = await wechatWorkPostJson<CreateWebinarResponse>(
      "/meeting/webinar/create",
      token,
      body,
    )
    return { webinar_id: data.meetingid ?? "" }
  },
}
