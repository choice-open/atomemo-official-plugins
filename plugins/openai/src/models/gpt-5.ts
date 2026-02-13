import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gpt5Model = {
  name: "gpt-5",
  description: t("OPENAI_GPT_5_DESCRIPTION"),
  display_name: t("OPENAI_GPT_5_DISPLAY_NAME"),
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
    input: 2.0,
    input_cache_read: 1.0,
    output: 8.0,
  },
  unsupported_parameters: [],
} satisfies ModelDefinition

