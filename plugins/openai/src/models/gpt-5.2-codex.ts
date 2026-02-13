import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gpt52CodexModel = {
  name: "gpt-5.2-codex",
  description: t("OPENAI_GPT_5_2_CODEX_DESCRIPTION"),
  display_name: t("OPENAI_GPT_5_2_CODEX_DISPLAY_NAME"),
  icon: "🤖",
  model_type: "llm",
  input_modalities: ["text"],
  output_modalities: ["text"],
  override_parameters: {
    temperature: {
      default: 0.8,
      maximum: 2,
      minimum: 0,
    },
  },
  pricing: {
    currency: "USD",
    input: 2.5,
    input_cache_read: 1.25,
    output: 10,
  },
  unsupported_parameters: [],
} satisfies ModelDefinition

