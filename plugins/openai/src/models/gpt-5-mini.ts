import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gpt5MiniModel = {
  name: "gpt-5-mini",
  description: t("OPENAI_GPT_5_MINI_DESCRIPTION"),
  display_name: t("OPENAI_GPT_5_MINI_DISPLAY_NAME"),
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
    input: 0.3,
    input_cache_read: 0.15,
    output: 1.2,
  },
  unsupported_parameters: [],
} satisfies ModelDefinition

