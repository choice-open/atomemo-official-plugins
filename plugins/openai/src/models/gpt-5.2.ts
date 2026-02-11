import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gpt52Model = {
  name: "gpt-5.2",
  description: t("OPENAI_GPT_5_2_DESCRIPTION"),
  display_name: t("OPENAI_GPT_5_2_DISPLAY_NAME"),
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
    input: 1.75,
    input_cache_read: 0.175,
    output: 14.0,
  },
  unsupported_parameters: ["parallel_tool_calls", "verbosity"],
} satisfies ModelDefinition

