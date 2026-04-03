import type {
  JsonValue,
  ToolDefinition,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { invokeImageTool } from "./_shared/client"
import { credentialParam, sharedParams } from "./_shared/parameters"
import {
  parseWithSchema,
  promptParametersSchema,
} from "./_shared/validation"
import editImageSkill from "./edit-image-skill.md" with { type: "text" }

const parameters: ToolDefinition["parameters"] = [
  credentialParam,
  {
    name: "prompt",
    type: "string",
    required: true,
    display_name: t("EDIT_IMAGE_PROMPT_DISPLAY_NAME"),
    ai: {
      llm_description: t("EDIT_IMAGE_PROMPT_AI_DESCRIPTION"),
    },
    ui: {
      component: "textarea",
      hint: t("EDIT_IMAGE_PROMPT_HINT"),
      placeholder: t("EDIT_IMAGE_PROMPT_PLACEHOLDER"),
      support_expression: true,
      width: "full",
    },
  },
  {
    name: "image",
    type: "file_ref",
    required: true,
    display_name: t("EDIT_IMAGE_IMAGE_DISPLAY_NAME"),
    ai: {
      llm_description: t("EDIT_IMAGE_IMAGE_AI_DESCRIPTION"),
    },
    ui: {
      hint: t("EDIT_IMAGE_IMAGE_HINT"),
      support_expression: true,
      width: "full",
    },
  },
  ...sharedParams,
]

export const editImageTool = {
  name: "edit-image",
  display_name: t("EDIT_IMAGE_DISPLAY_NAME"),
  description: t("EDIT_IMAGE_DESCRIPTION"),
  skill: editImageSkill,
  icon: "✏️",
  parameters,
  async invoke({ args, context }): Promise<JsonValue> {
    const { prompt } = parseWithSchema(
      promptParametersSchema,
      args.parameters,
      "Prompt is required.",
    )

    if (!prompt?.trim()) {
      throw new Error("Prompt is required.")
    }

    if (!args.parameters.image) {
      throw new Error("An input image is required for editing.")
    }
    const imageRef = context.files.parseFileRef(args.parameters.image)

    let imageContent = imageRef.content
    const imageMimeType = imageRef.mime_type || "image/png"

    if (!imageContent) {
      imageContent = (await context.files.download(imageRef)).content
    }

    if (!imageContent) {
      throw new Error("Failed to read the input image content.")
    }

    return invokeImageTool({
      args,
      context,
      contents: [
        { text: prompt },
        {
          inlineData: {
            mimeType: imageMimeType,
            data: imageContent,
          },
        },
      ],
      filenamePrefix: "nano-banana-edit-",
    })
  },
} satisfies ToolDefinition
