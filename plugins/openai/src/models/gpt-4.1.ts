import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gpt41Model = {
  name: "gpt-4.1",
  description: t("OPENAI_GPT_4_1_DESCRIPTION"),
  display_name: t("OPENAI_GPT_4_1_DISPLAY_NAME"),
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
    input: 0.002,
    input_cache_read: 0.0005,
    output: 0.008,
  },
  unsupported_parameters: [],
} satisfies ModelDefinition

