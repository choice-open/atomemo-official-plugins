import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gpt5NanoModel = {
  name: "gpt-5-nano",
  description: t("OPENAI_GPT_5_NANO_DESCRIPTION"),
  display_name: t("OPENAI_GPT_5_NANO_DISPLAY_NAME"),
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
    input: 0.1,
    input_cache_read: 0.05,
    output: 0.4,
  },
  unsupported_parameters: [],
} satisfies ModelDefinition

