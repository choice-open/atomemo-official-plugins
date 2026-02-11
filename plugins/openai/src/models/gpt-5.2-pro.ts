import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gpt52ProModel = {
  name: "gpt-5.2-pro",
  description: t("OPENAI_GPT_5_2_PRO_DESCRIPTION"),
  display_name: t("OPENAI_GPT_5_2_PRO_DISPLAY_NAME"),
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
    input: 3,
    input_cache_read: 1.5,
    output: 12,
  },
  unsupported_parameters: [],
} satisfies ModelDefinition

