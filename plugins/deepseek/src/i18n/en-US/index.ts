import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "DeepSeek",
  PLUGIN_DESCRIPTION:
    "DeepSeek official models for chat completions (DeepSeek-V3.2, non-thinking and thinking modes).",

  DEEPSEEK_API_KEY_DISPLAY_NAME: "DeepSeek API Key",
  DEEPSEEK_API_KEY_DESCRIPTION: "Your DeepSeek API key for chat completions",
  DEEPSEEK_API_KEY_HINT: "Enter your DeepSeek API key",
  DEEPSEEK_API_KEY_PLACEHOLDER: "sk-...",

  DEEPSEEK_CHAT_DISPLAY_NAME: "DeepSeek Chat",
  DEEPSEEK_CHAT_DESCRIPTION:
    "DeepSeek-V3.2 non-thinking mode: fast chat, tool calls, JSON output.",

  DEEPSEEK_REASONER_DISPLAY_NAME: "DeepSeek Reasoner",
  DEEPSEEK_REASONER_DESCRIPTION:
    "DeepSeek-V3.2 thinking mode: extended reasoning, tool calls, JSON output.",
} satisfies BaseTranslation

export default en_US
