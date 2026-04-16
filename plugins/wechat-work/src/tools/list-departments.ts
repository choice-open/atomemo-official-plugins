import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types";
import {
  getAccessTokenForCredential,
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client";
import listDepartmentsSkill from "./list-departments-skill.md" with { type: "text" };

type SimpleListResponse = {
  errcode?: number;
  errmsg?: string;
  department_id?: Array<{ id: number; parentid: number; order: number }>;
};

export const listDepartmentsTool: ToolDefinition = {
  name: "wechat-work-list-departments",
  display_name: {
    en_US: "List departments",
    zh_Hans: "获取部门列表",
  },
  description: {
    en_US:
      "Fetch the simplified department ID list from WeChat Work (子部门 ID 列表).",
    zh_Hans: "获取企业微信组织架构中的部门 ID 列表（simplelist 接口）。",
  },
  skill: listDepartmentsSkill,
  icon: "🗂️",
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
      name: "parent_department_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Parent department ID",
        zh_Hans: "父部门 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US:
            "Optional. When empty, returns the full organization tree per API defaults.",
          zh_Hans: "可选。留空则按接口默认返回全量组织架构。",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string;
      parent_department_id?: string;
    };
    const credentialId = params.wechat_work_credential;
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.");
    }
    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    );
    const token = cred.access_token;
    if (!token) {
      throw new Error(
        "Wechat work credential is missing or has no access_token.",
      );
    }
    const extra: Record<string, string> = {};
    const parent = params.parent_department_id?.trim();
    if (parent) extra.id = parent;

    const data = await wechatWorkGetJson<SimpleListResponse>(
      "/department/simplelist",
      token,
      Object.keys(extra).length ? extra : undefined,
    );
    return { department_id: data.department_id ?? [] };
  },
};
