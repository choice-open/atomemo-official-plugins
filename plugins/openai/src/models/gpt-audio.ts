import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gptAudioModel = {
  name: "gpt-audio",
  description: t("OPENAI_GPT_AUDIO_DESCRIPTION"),
  display_name: t("OPENAI_GPT_AUDIO_DISPLAY_NAME"),
  icon: "🤖",
  model_type: "llm",
  input_modalities: ["text"],
  output_modalities: ["text"],
  pricing: {
    currency: "USD",
    input: 1.0,
    input_cache_read: 0.5,
    output: 4.0,
  },
  unsupported_parameters: [],
} satisfies ModelDefinition

