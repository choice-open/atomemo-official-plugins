import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createEventCategorySkill from "./create-event-category-skill.md" with {
  type: "text",
}

type CreateEventCategoryResponse = {
  errcode?: number
  errmsg?: string
  category_id?: string
}

export const createEventCategoryTool: ToolDefinition = {
  name: "wechat-work-create-event-category",
  display_name: {
    en_US: "Create event category",
    zh_Hans: "创建事件类别",
  },
  description: {
    en_US: "Create a new event category for patrol or resident reports.",
    zh_Hans: "创建巡查上报或居民上报的事件类别。",
  },
  skill: createEventCategorySkill,
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
      name: "category_name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Category name",
        zh_Hans: "分类名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Category name (max 30 characters)",
          zh_Hans: "分类名称（最多30个字符）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "level",
      type: "string",
      required: true,
      display_name: {
        en_US: "Category level",
        zh_Hans: "分类层级",
      },
      ui: {
        component: "select",
        options: [
          { label: { en_US: "Level 1 (Top category)", zh_Hans: "一级分类" }, value: "1" },
          { label: { en_US: "Level 2 (Sub category)", zh_Hans: "二级分类" }, value: "2" },
        ],
        hint: {
          en_US: "Category level: 1 for top-level, 2 for sub-category",
          zh_Hans: "分类层级：1为一级分类，2为二级分类",
        },
        width: "full",
      },
    },
    {
      name: "parent_category_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Parent category ID",
        zh_Hans: "一级分类ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Required for level 2 categories",
          zh_Hans: "二级分类时必填，填一级分类的ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      category_name?: string
      level?: string
      parent_category_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const categoryName = typeof params.category_name === "string" ? params.category_name.trim() : ""
    if (!categoryName) {
      throw new Error("Category name is required.")
    }
    const level = params.level?.trim()
    if (!level || !["1", "2"].includes(level)) {
      throw new Error("Level must be 1 or 2.")
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
      category_name: categoryName,
      level: parseInt(level, 10),
    }
    const parentCategoryId = params.parent_category_id?.trim()
    if (parentCategoryId) {
      body.parent_category_id = parentCategoryId
    }

    const data = await wechatWorkPostJson<CreateEventCategoryResponse>(
      "/report/grid/add_cata",
      token,
      body,
    )
    return { category_id: data.category_id ?? "" }
  },
}
