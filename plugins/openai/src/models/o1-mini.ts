import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const o1MiniModel = {
  name: "o1-mini",
  description: t("OPENAI_O1_MINI_DESCRIPTION"),
  display_name: t("OPENAI_O1_MINI_DISPLAY_NAME"),
  icon: "🤖",
  model_type: "llm",
  input_modalities: ["text"],
  output_modalities: ["text"],
  pricing: {
    currency: "USD",
    input: 0.003,
    input_cache_read: 0.003,
    output: 0.012,
  },
  unsupported_parameters: ["temperature", "parallel_tool_calls", "verbosity"],
} satisfies ModelDefinition

