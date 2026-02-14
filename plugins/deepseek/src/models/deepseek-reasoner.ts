import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const deepseekReasonerModel = {
  name: "deepseek-reasoner",
  description: t("DEEPSEEK_REASONER_DESCRIPTION"),
  display_name: t("DEEPSEEK_REASONER_DISPLAY_NAME"),
  icon: "🤖",
  model_type: "llm",
  input_modalities: ["text"],
  output_modalities: ["text"],
  override_parameters: {
    temperature: {
      default: 1,
      maximum: 2,
      minimum: 0,
    },
  },
  pricing: {
    currency: "USD",
    input: 0.25,
    input_cache_read: 0.125,
    output: 0.38,
  },
  unsupported_parameters: ["parallel_tool_calls", "verbosity"],
} satisfies ModelDefinition
