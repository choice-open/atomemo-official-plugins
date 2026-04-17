import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import residentReportSkill from "./resident-report-skill.md" with {
  type: "text",
}

type ResidentReportResponse = {
  errcode?: number
  errmsg?: string
  order_id?: string
}

export const residentReportTool: ToolDefinition = {
  name: "wechat-work-resident-report",
  display_name: {
    en_US: "Submit resident report",
    zh_Hans: "居民上报",
  },
  description: {
    en_US: "Submit a resident report in WeChat Work government-citizen communication.",
    zh_Hans: "在企业微信政民沟通中提交居民上报。",
  },
  skill: residentReportSkill,
  icon: "🏠",
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
      name: "grid_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Grid ID",
        zh_Hans: "网格ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Grid ID to report to",
          zh_Hans: "所属网格ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "category_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Category ID",
        zh_Hans: "事件类别ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Event category ID",
          zh_Hans: "事件类别ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "desc",
      type: "string",
      required: true,
      display_name: {
        en_US: "Description",
        zh_Hans: "事件描述",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Event description (max 500 characters)",
          zh_Hans: "事件描述（最多500个字符）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "urge_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "Urgency level",
        zh_Hans: "紧急程度",
      },
      ui: {
        component: "select",
        options: [
          { label: { en_US: "Normal (1)", zh_Hans: "一般 (1)" }, value: "1" },
          { label: { en_US: "Important (2)", zh_Hans: "重要 (2)" }, value: "2" },
          { label: { en_US: "Urgent (3)", zh_Hans: "紧急 (3)" }, value: "3" },
        ],
        hint: {
          en_US: "Urgency level: 1-Normal, 2-Important, 3-Urgent",
          zh_Hans: "紧急程度：1-一般，2-重要，3-紧急",
        },
        width: "full",
      },
    },
    {
      name: "reporter_name",
      type: "string",
      required: false,
      display_name: {
        en_US: "Reporter name",
        zh_Hans: "上报人名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Name of the reporter",
          zh_Hans: "上报人名称",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "reporter_mobile",
      type: "string",
      required: false,
      display_name: {
        en_US: "Reporter mobile",
        zh_Hans: "上报人手机",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Reporter mobile number",
          zh_Hans: "上报人手机号",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "address",
      type: "string",
      required: false,
      display_name: {
        en_US: "Address",
        zh_Hans: "发生地点",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Location address",
          zh_Hans: "事件发生地点",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "latitude",
      type: "string",
      required: false,
      display_name: {
        en_US: "Latitude",
        zh_Hans: "纬度",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Latitude (-90 to 90)",
          zh_Hans: "纬度（-90到90）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "longitude",
      type: "string",
      required: false,
      display_name: {
        en_US: "Longitude",
        zh_Hans: "经度",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Longitude (-180 to 180)",
          zh_Hans: "经度（-180到180）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "image_urls",
      type: "string",
      required: false,
      display_name: {
        en_US: "Image URLs",
        zh_Hans: "图片URL列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated image URLs (max 9)",
          zh_Hans: "图片URL列表，逗号分隔（最多9张）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "video_media_ids",
      type: "string",
      required: false,
      display_name: {
        en_US: "Video media IDs",
        zh_Hans: "视频media_id列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated video media IDs (max 3)",
          zh_Hans: "视频media_id列表，逗号分隔（最多3个）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      grid_id?: string
      category_id?: string
      desc?: string
      urge_type?: string
      reporter_name?: string
      reporter_mobile?: string
      address?: string
      latitude?: string
      longitude?: string
      image_urls?: string
      video_media_ids?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const gridId = typeof params.grid_id === "string" ? params.grid_id.trim() : ""
    if (!gridId) {
      throw new Error("Grid ID is required.")
    }
    const categoryId = typeof params.category_id === "string" ? params.category_id.trim() : ""
    if (!categoryId) {
      throw new Error("Category ID is required.")
    }
    const desc = typeof params.desc === "string" ? params.desc.trim() : ""
    if (!desc) {
      throw new Error("Description is required.")
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

    const body: Record<string, unknown> & { location?: { address: string; latitude?: number; longitude?: number } } = {
      grid_id: gridId,
      category_id: categoryId,
      desc: desc,
    }
    const urgeType = params.urge_type?.trim()
    if (urgeType && ["1", "2", "3"].includes(urgeType)) {
      body.urge_type = parseInt(urgeType, 10)
    }
    const reporterName = params.reporter_name?.trim()
    if (reporterName) body.reporter_name = reporterName
    const reporterMobile = params.reporter_mobile?.trim()
    if (reporterMobile) body.reporter_mobile = reporterMobile
    const address = params.address?.trim()
    if (address) {
      body.location = { address }
      const latitude = params.latitude?.trim()
      const longitude = params.longitude?.trim()
      if (latitude) {
        const lat = parseFloat(latitude)
        if (!Number.isNaN(lat)) body.location.latitude = lat
      }
      if (longitude) {
        const lng = parseFloat(longitude)
        if (!Number.isNaN(lng)) body.location.longitude = lng
      }
    }
    const imageUrls = params.image_urls?.trim()
    if (imageUrls) {
      body.image_urls = imageUrls.split(",").map((s) => s.trim()).filter(Boolean)
    }
    const videoMediaIds = params.video_media_ids?.trim()
    if (videoMediaIds) {
      body.video_media_ids = videoMediaIds.split(",").map((s) => s.trim()).filter(Boolean)
    }

    const data = await wechatWorkPostJson<ResidentReportResponse>(
      "/report/resident/add",
      token,
      body,
    )
    return { order_id: data.order_id ?? "" }
  },
}
