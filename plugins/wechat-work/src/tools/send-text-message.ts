import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types";
import {
  getAccessTokenForCredential,
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client";
import sendTextMessageSkill from "./send-text-message-skill.md" with { type: "text" };

type SendMessageResponse = {
  errcode?: number;
  errmsg?: string;
  invaliduser?: string;
  invalidparty?: string;
  invalidtag?: string;
  msgid?: string;
};

export const sendTextMessageTool: ToolDefinition = {
  name: "wechat-work-send-text-message",
  display_name: {
    en_US: "Send app text message",
    zh_Hans: "发送应用文本消息",
  },
  description: {
    en_US:
      "Send a text message to members via a self-built application (消息推送).",
    zh_Hans: "通过自建应用向成员发送文本消息（应用消息）。",
  },
  skill: sendTextMessageSkill,
  icon: "✉️",
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
          en_US:
            "The numeric agent id of your self-built app (应用管理 → 应用详情).",
          zh_Hans: "自建应用的 AgentId（应用管理 → 对应应用详情）。",
        },
      },
    },
    {
      name: "touser",
      type: "string",
      required: true,
      display_name: {
        en_US: "To users (userid)",
        zh_Hans: "接收成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US:
            "Pipe-separated userids, e.g. zhangsan|lisi. Use |all| to broadcast when allowed.",
          zh_Hans: "成员 userid，多个用 | 分隔，例如 zhangsan|lisi。",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "content",
      type: "string",
      required: true,
      display_name: {
        en_US: "Message content",
        zh_Hans: "消息内容",
      },
      ui: {
        component: "textarea",
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string;
      agent_id?: number;
      touser?: string;
      content?: string;
    };
    const credentialId = params.wechat_work_credential;
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.");
    }
    const touser =
      typeof params.touser === "string" ? params.touser.trim() : "";
    const content = typeof params.content === "string" ? params.content : "";
    if (!touser || !content) {
      throw new Error("touser and content are required.");
    }
    if (
      typeof params.agent_id !== "number" ||
      !Number.isFinite(params.agent_id)
    ) {
      throw new Error("agent_id must be a valid integer.");
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

    const data = await wechatWorkPostJson<SendMessageResponse>(
      "/message/send",
      token,
      {
        touser,
        msgtype: "text",
        agentid: params.agent_id,
        text: { content },
      },
    );
    return {
      msgid: data.msgid ?? null,
      invaliduser: data.invaliduser ?? "",
      invalidparty: data.invalidparty ?? "",
      invalidtag: data.invalidtag ?? "",
    };
  },
};
