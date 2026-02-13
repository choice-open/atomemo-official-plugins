import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "DeepSeek",
  PLUGIN_DESCRIPTION:
    "DeepSeek 官方模型，用于对话补全（DeepSeek-V3.2，非思考模式与思考模式）。",

  DEEPSEEK_API_KEY_DISPLAY_NAME: "DeepSeek API Key",
  DEEPSEEK_API_KEY_DESCRIPTION: "用于对话补全的 DeepSeek API Key",
  DEEPSEEK_API_KEY_HINT: "输入 DeepSeek API Key",
  DEEPSEEK_API_KEY_PLACEHOLDER: "sk-...",

  DEEPSEEK_CHAT_DISPLAY_NAME: "DeepSeek Chat",
  DEEPSEEK_CHAT_DESCRIPTION:
    "DeepSeek-V3.2 非思考模式：快速对话、工具调用、JSON 输出。",

  DEEPSEEK_REASONER_DISPLAY_NAME: "DeepSeek Reasoner",
  DEEPSEEK_REASONER_DESCRIPTION:
    "DeepSeek-V3.2 思考模式：长链推理、工具调用、JSON 输出。",
} satisfies Translation

export default zh_Hans
