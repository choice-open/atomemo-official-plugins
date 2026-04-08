import * as lark from "@larksuiteoapi/node-sdk";
import type {
  PropertyCredentialId,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types";

const credentialParameter: PropertyCredentialId<"credentialId"> = {
  name: "credentialId",
  type: "credential_id",
  credential_name: "feishu-app-credential",
  display_name: {
    en_US: "Credential",
    zh_Hans: "凭证",
  },
  required: true,
  ui: {
    component: "credential-select",
  },
};

export const sendFeishuAppMessageTool = {
  name: "send_feishu_app_message",
  display_name: {
    en_US: "Send Feishu App Message",
    zh_Hans: "发送飞书应用消息",
  },
  description: {
    en_US:
      "Send a text message via Feishu server-side API using self-built app credentials",
    zh_Hans: "使用自建应用凭证通过飞书服务端 API 发送文本消息",
  },
  icon: "💬",
  parameters: [
    credentialParameter,
    {
      name: "receive_id_type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Receive ID Type",
        zh_Hans: "接收者 ID 类型",
      },
      ui: {
        component: "select",
        width: "full",
        support_expression: true,
        options: [
          {
            label: { en_US: "Open ID", zh_Hans: "Open ID" },
            value: "open_id",
          },
          {
            label: { en_US: "User ID", zh_Hans: "User ID" },
            value: "user_id",
          },
          {
            label: { en_US: "Union ID", zh_Hans: "Union ID" },
            value: "union_id",
          },
          {
            label: { en_US: "Chat ID", zh_Hans: "群聊 ID" },
            value: "chat_id",
          },
          {
            label: { en_US: "Email", zh_Hans: "邮箱" },
            value: "email",
          },
        ],
      },
    },
    {
      name: "receive_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Receive ID",
        zh_Hans: "接收者 ID",
      },
      ui: {
        component: "input",
        width: "full",
        support_expression: true,
        placeholder: {
          en_US: "ou_xxx / oc_xxx / user@example.com",
          zh_Hans: "ou_xxx / oc_xxx / user@example.com",
        },
      },
    },
    {
      name: "text",
      type: "string",
      required: true,
      display_name: {
        en_US: "Message Text",
        zh_Hans: "消息文本",
      },
      ui: {
        component: "textarea",
        width: "full",
        support_expression: true,
        placeholder: {
          en_US: "Hello from Atomemo",
          zh_Hans: "来自 Atomemo 的消息",
        },
      },
    },
  ],
  async invoke({ args }) {
    const parameters =
      args.parameters &&
      typeof args.parameters === "object" &&
      !Array.isArray(args.parameters)
        ? (args.parameters as Record<string, unknown>)
        : {};
    const credentials =
      args.credentials &&
      typeof args.credentials === "object" &&
      !Array.isArray(args.credentials)
        ? (args.credentials as Record<string, unknown>)
        : {};

    const credentialId = String(parameters.credentialId ?? "").trim();
    const receiveIdType = String(parameters.receive_id_type ?? "").trim();
    const receiveId = String(parameters.receive_id ?? "").trim();
    const text = String(parameters.text ?? "").trim();

    if (!credentialId) {
      throw new Error("Missing credentialId");
    }
    if (!receiveIdType) {
      throw new Error("Parameter `receive_id_type` is required.");
    }
    if (!receiveId) {
      throw new Error("Parameter `receive_id` is required.");
    }
    if (!text) {
      throw new Error("Parameter `text` is required.");
    }

    const credentialValue = credentials[credentialId];
    const credential =
      credentialValue &&
      typeof credentialValue === "object" &&
      !Array.isArray(credentialValue)
        ? (credentialValue as Record<string, unknown>)
        : {};
    const appId = String(credential.app_id ?? "").trim();
    const appSecret = String(credential.app_secret ?? "").trim();

    if (!appId || !appSecret) {
      throw new Error(
        "Selected credential is invalid: missing app_id or app_secret",
      );
    }

    // Self-built app mode: appType defaults to SelfBuild; here we set it explicitly.
    const client = new lark.Client({
      appId,
      appSecret,
      appType: lark.AppType.SelfBuild,
      domain: lark.Domain.Feishu,
    });

    const response = await client.im.message.create({
      params: {
        receive_id_type: receiveIdType as
          | "open_id"
          | "user_id"
          | "union_id"
          | "chat_id"
          | "email",
      },
      data: {
        receive_id: receiveId,
        msg_type: "text",
        content: JSON.stringify({ text }),
      },
    });
    return {
      message: "Feishu app message sent successfully",
      request_payload: {
        receive_id_type: receiveIdType,
        receive_id: receiveId,
        msg_type: "text",
      },
      response_raw: JSON.stringify(response),
    };
  },
} satisfies ToolDefinition;
