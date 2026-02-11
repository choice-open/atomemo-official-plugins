import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const gptAudioMiniModel = {
  name: "gpt-audio-mini",
  description: t("OPENAI_GPT_AUDIO_MINI_DESCRIPTION"),
  display_name: t("OPENAI_GPT_AUDIO_MINI_DISPLAY_NAME"),
  icon: "🤖",
  model_type: "llm",
  input_modalities: ["text"],
  output_modalities: ["text"],
  pricing: {
    currency: "USD",
    input: 0.3,
    input_cache_read: 0.15,
    output: 1.2,
  },
  unsupported_parameters: [],
} satisfies ModelDefinition

