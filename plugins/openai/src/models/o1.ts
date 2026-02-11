import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const o1Model = {
  name: "o1",
  description: t("OPENAI_O1_DESCRIPTION"),
  display_name: t("OPENAI_O1_DISPLAY_NAME"),
  icon: "🤖",
  model_type: "llm",
  input_modalities: ["text"],
  output_modalities: ["text"],
  pricing: {
    currency: "USD",
    input: 0.015,
    input_cache_read: 0.0075,
    output: 0.06,
  },
  unsupported_parameters: ["temperature", "parallel_tool_calls", "verbosity"],
} satisfies ModelDefinition

