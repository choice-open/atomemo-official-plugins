import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gpt4oNanoModel = {
  name: "gpt-4o-nano",
  description: t("OPENAI_GPT_4O_NANO_DESCRIPTION"),
  display_name: t("OPENAI_GPT_4O_NANO_DISPLAY_NAME"),
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
    input: 0.08,
    input_cache_read: 0.04,
    output: 0.32,
  },
  unsupported_parameters: [],
} satisfies ModelDefinition

