import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "飞书插件",
  PLUGIN_DESCRIPTION: "在 Atomemo 中接入飞书能力",
  DEMO_TOOL_DISPLAY_NAME: "发送飞书 Webhook 消息",
  DEMO_TOOL_DESCRIPTION: "通过飞书群机器人 Webhook 发送文本消息",
  LOCATION_DISPLAY_NAME: "Webhook 地址",
  LOCATION_HINT: "飞书群机器人的 webhook 地址",
  LOCATION_PLACEHOLDER: "https://open.feishu.cn/open-apis/bot/v2/hook/...",
} satisfies Translation

export default zh_Hans
