import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { invokeImageTool } from "./_shared/client"
import { credentialParam, sharedParams } from "./_shared/parameters"
import { parseWithSchema, promptParametersSchema } from "./_shared/validation"
import generateImageSkill from "./generate-image-skill.md" with { type: "text" }

export const generateImageTool = {
  name: "generate-image",
  display_name: t("GENERATE_IMAGE_DISPLAY_NAME"),
  description: t("GENERATE_IMAGE_DESCRIPTION"),
  skill: generateImageSkill,
  icon: "🎨",
  parameters: [
    credentialParam,
    {
      name: "prompt",
      type: "string",
      required: true,
      display_name: t("GENERATE_IMAGE_PROMPT_DISPLAY_NAME"),
      ai: {
        llm_description: t("GENERATE_IMAGE_PROMPT_AI_DESCRIPTION"),
      },
      ui: {
        component: "textarea",
        hint: t("GENERATE_IMAGE_PROMPT_HINT"),
        placeholder: t("GENERATE_IMAGE_PROMPT_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    ...sharedParams,
  ],
  async invoke({ args, context }): Promise<JsonValue> {
    const { prompt } = parseWithSchema(
      promptParametersSchema,
      args.parameters,
      "Prompt is required.",
    )

    if (!prompt?.trim()) {
      throw new Error("Prompt is required.")
    }

    return invokeImageTool({
      args,
      context,
      contents: prompt,
      filenamePrefix: "nano-banana-",
    })
  },
} satisfies ToolDefinition
