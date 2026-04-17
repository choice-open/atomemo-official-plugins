import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types";
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client";
import listMailSkill from "./list-mail-skill.md" with { type: "text" };

type ListMailResponse = {
  errcode?: number;
  errmsg?: string;
  mail_list?: Array<{
    mailid: string;
    from: Array<{ userid: string; email: string }>;
    to: Array<{ userid: string; email: string }>;
    cc: Array<{ userid: string; email: string }>;
    bcc: Array<{ userid: string; email: string }>;
    title: string;
    generate_type: number;
    send_time: number;
    body_summary: string;
    is_need_read: number;
    read_time?: number;
  }>;
  default_inbox?: boolean;
  has_more?: boolean;
};

export const listMailTool: ToolDefinition = {
  name: "wechat-work-list-mail",
  display_name: {
    en_US: "List inbox emails",
    zh_Hans: "获取收件箱列表",
  },
  description: {
    en_US: "Get the list of received emails (inbox).",
    zh_Hans: "获取收件箱邮件列表。",
  },
  skill: listMailSkill,
  icon: "📥",
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
      name: "begin_time",
      type: "integer",
      required: false,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间(Unix时间戳)",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "Start time in Unix timestamp",
          zh_Hans: "Unix时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "integer",
      required: false,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间(Unix时间戳)",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "End time in Unix timestamp",
          zh_Hans: "Unix时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "number",
      required: false,
      display_name: {
        en_US: "Page size",
        zh_Hans: "每页数量",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "Number of items per page (default 50)",
          zh_Hans: "每页数量，默认50",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "cursor",
      type: "string",
      required: false,
      display_name: {
        en_US: "Cursor for pagination",
        zh_Hans: "分页游标",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Cursor for pagination",
          zh_Hans: "分页游标",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string;
      begin_time?: number;
      end_time?: number;
      limit?: number;
      cursor?: string;
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

    const query: Record<string, string> = {};
    if (typeof params.begin_time === "number") {
      query.begin_time = String(params.begin_time);
    }
    if (typeof params.end_time === "number") {
      query.end_time = String(params.end_time);
    }
    if (typeof params.limit === "number") {
      query.limit = String(params.limit);
    }
    if (params.cursor?.trim()) {
      query.cursor = params.cursor.trim();
    }

    const data = await wechatWorkGetJson<ListMailResponse>(
      "/mail/list",
      token,
      query,
    );
    return {
      mail_list: data.mail_list ?? [],
      default_inbox: data.default_inbox ?? false,
      has_more: data.has_more ?? false,
    };
  },
};
