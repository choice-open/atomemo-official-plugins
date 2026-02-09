import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const demoModelChat = {
  name: "demo-deepseek-chat",
  description: t("DEMO_DEEPSEEK_CHAT_DESCRIPTION"),
  display_name: t("DEMO_DEEPSEEK_CHAT_DISPLAY_NAME"),
  icon: "🤖",
  model_type: "llm",
  input_modalities: ["text"],
  output_modalities: ["text"],
  override_parameters: {
    temperature: {
      default: 1.3,
      maximum: 2.0,
      minimum: 0.0,
    },
  },
  pricing: {
    currency: "CNY",
    input_cache_read: 0.028,
    input: 0.28,
    output: 0.42,
  },
  unsupported_parameters: [
    "parallel_tool_calls",
    "structured_outputs",
    "verbosity",
  ],
} satisfies ModelDefinition
