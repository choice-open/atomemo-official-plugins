import type { BaseTranslation } from "../i18n-types"

const en_US = {
  // Plugin
  PLUGIN_DISPLAY_NAME: "Nano Banana Image Studio",
  PLUGIN_DESCRIPTION:
    "Generate and edit images with Google's Gemini image models, including Nano Banana and Nano Banana Pro.",

  // Credential
  CREDENTIAL_DISPLAY_NAME: "Gemini API Key",
  CREDENTIAL_DESCRIPTION:
    "API key used to authenticate Google Gemini API requests.",
  CREDENTIAL_API_KEY_DISPLAY_NAME: "Gemini API Key",
  CREDENTIAL_API_KEY_HINT: "Paste your Gemini API key from Google AI Studio.",
  CREDENTIAL_API_KEY_PLACEHOLDER: "AIza...",
  CREDENTIAL_BASE_URL_DISPLAY_NAME: "Base URL",
  CREDENTIAL_BASE_URL_HINT:
    "Optional custom Gemini-compatible endpoint. If not provided, the official Google endpoint will be used.",
  CREDENTIAL_BASE_URL_PLACEHOLDER: "https://your-proxy.example.com",

  // Shared parameters
  PARAM_CREDENTIAL_DISPLAY_NAME: "Gemini Credential",
  PARAM_CREDENTIAL_AI_DESCRIPTION:
    "Credential ID string referencing a configured `gemini-api-key` credential. Write the selected credential ID value.",
  PARAM_MODEL_DISPLAY_NAME: "Model",
  PARAM_MODEL_HINT: "Select the Nano Banana model to use.",
  PARAM_MODEL_AI_DESCRIPTION:
    "`gemini-3.1-flash-image-preview` supports the broadest parameter set in this tool, including thinking, Google Search grounding, `512` resolution, and extra aspect ratios `1:4`, `4:1`, `1:8`, `8:1`. `gemini-3-pro-image-preview` does not use thinking and does not support `512` or the extra aspect ratios. `gemini-2.5-flash-image` ignores `resolution`, `thinking_level`, `include_thoughts`, and `enable_search_grounding` in this implementation. Allowed values: `gemini-3.1-flash-image-preview`, `gemini-3-pro-image-preview`, `gemini-2.5-flash-image`.",
  PARAM_MODEL_OPTION_GEMINI_31_FLASH_IMAGE: "Nano Banana 2 (3.1 Flash Image)",
  PARAM_MODEL_OPTION_GEMINI_3_PRO_IMAGE: "Nano Banana Pro (3 Pro Image)",
  PARAM_MODEL_OPTION_GEMINI_25_FLASH_IMAGE: "Nano Banana (2.5 Flash Image)",
  PARAM_ASPECT_RATIO_DISPLAY_NAME: "Aspect Ratio",
  PARAM_ASPECT_RATIO_HINT: "Aspect ratio of the generated image.",
  PARAM_ASPECT_RATIO_AI_DESCRIPTION:
    "Base aspect ratios `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9` are supported broadly. Extra ratios `1:4`, `4:1`, `1:8`, `8:1` are only applied with `gemini-3.1-flash-image-preview`. Allowed values: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `3:2`, `2:3`, `5:4`, `4:5`, `21:9`, `4:1`, `1:4`, `8:1`, `1:8`.",
  PARAM_ASPECT_RATIO_OPTION_1_1: "1:1 (Square)",
  PARAM_ASPECT_RATIO_OPTION_16_9: "16:9 (Landscape)",
  PARAM_ASPECT_RATIO_OPTION_9_16: "9:16 (Portrait)",
  PARAM_ASPECT_RATIO_OPTION_4_3: "4:3 (Standard)",
  PARAM_ASPECT_RATIO_OPTION_3_4: "3:4 (Portrait)",
  PARAM_ASPECT_RATIO_OPTION_3_2: "3:2 (Photo)",
  PARAM_ASPECT_RATIO_OPTION_2_3: "2:3 (Portrait Photo)",
  PARAM_ASPECT_RATIO_OPTION_5_4: "5:4 (Large Format)",
  PARAM_ASPECT_RATIO_OPTION_4_5: "4:5 (Portrait Large)",
  PARAM_ASPECT_RATIO_OPTION_21_9: "21:9 (Ultra-wide)",
  PARAM_ASPECT_RATIO_OPTION_4_1: "4:1 (Banner - NB2 only)",
  PARAM_ASPECT_RATIO_OPTION_1_4: "1:4 (Tall Banner - NB2 only)",
  PARAM_ASPECT_RATIO_OPTION_8_1: "8:1 (Ultra Banner - NB2 only)",
  PARAM_ASPECT_RATIO_OPTION_1_8: "1:8 (Ultra Tall - NB2 only)",
  PARAM_RESOLUTION_DISPLAY_NAME: "Resolution",
  PARAM_RESOLUTION_HINT: "Output resolution of the generated image.",
  PARAM_RESOLUTION_AI_DESCRIPTION:
    "`gemini-3.1-flash-image-preview` supports `512`, `1K`, `2K`, `4K`. `gemini-3-pro-image-preview` supports `1K`, `2K`, `4K` only. `gemini-2.5-flash-image` ignores this parameter. Allowed values: `512`, `1K`, `2K`, `4K`.",
  PARAM_RESOLUTION_OPTION_512: "512 (0.5K - NB2 only)",
  PARAM_RESOLUTION_OPTION_1K: "1K (Default)",
  PARAM_RESOLUTION_OPTION_2K: "2K (High)",
  PARAM_RESOLUTION_OPTION_4K: "4K (Ultra High)",
  PARAM_THINKING_LEVEL_DISPLAY_NAME: "Thinking Level",
  PARAM_THINKING_LEVEL_HINT:
    "Controls reasoning depth. 'high' improves quality for complex prompts but increases latency. Only affects Nano Banana 2.",
  PARAM_THINKING_LEVEL_AI_DESCRIPTION:
    "This parameter is applied only with `gemini-3.1-flash-image-preview`; other models ignore it. Allowed values: `minimal`, `high`.",
  PARAM_THINKING_LEVEL_OPTION_MINIMAL: "Minimal (Faster)",
  PARAM_THINKING_LEVEL_OPTION_HIGH: "High (Better Quality)",
  PARAM_INCLUDE_THOUGHTS_DISPLAY_NAME: "Return Thoughts",
  PARAM_INCLUDE_THOUGHTS_HINT:
    "When enabled, the model's thought summary is returned in the tool response. Billing for thinking tokens still applies whether this is enabled or not.",
  PARAM_INCLUDE_THOUGHTS_AI_DESCRIPTION:
    "`true` returns the model's thought summary when thinking is supported. `false` hides it. This parameter is applied only with `gemini-3.1-flash-image-preview`; other models ignore it. This controls visibility only and does not guarantee that thinking token usage or billing is disabled. Allowed values: `true`, `false`.",
  PARAM_ENABLE_SEARCH_DISPLAY_NAME: "Google Search Grounding",
  PARAM_ENABLE_SEARCH_HINT:
    "Enable Google Search to generate images based on real-time information.",
  PARAM_ENABLE_SEARCH_AI_DESCRIPTION:
    "`true` enables Google Search grounding for prompts that depend on real-time or factual external information. `false` disables it. This parameter is applied only for `gemini-3.1-flash-image-preview` and `gemini-3-pro-image-preview`; `gemini-2.5-flash-image` ignores it. Allowed values: `true`, `false`.",
  PARAM_OUTPUT_STORAGE_DISPLAY_NAME: "Upload to Storage",
  PARAM_OUTPUT_STORAGE_HINT:
    "When enabled, uploads the generated image to persistent object storage. When disabled, returns the image in memory.",
  PARAM_OUTPUT_STORAGE_AI_DESCRIPTION:
    "`true` uploads the generated image to persistent storage. `false` returns an in-memory file reference only. Allowed values: `true`, `false`.",

  // Generate Image tool
  GENERATE_IMAGE_DISPLAY_NAME: "Generate Image",
  GENERATE_IMAGE_DESCRIPTION:
    "Generate an image from a text prompt using Nano Banana.",
  GENERATE_IMAGE_PROMPT_DISPLAY_NAME: "Prompt",
  GENERATE_IMAGE_PROMPT_AI_DESCRIPTION:
    "Write the full image generation instruction, including scene, subjects, composition, style, lighting, text to render, and important constraints. Value type: free-form string.",
  GENERATE_IMAGE_PROMPT_HINT:
    "Describe the image you want to generate. Be specific about style, lighting, composition, and details.",
  GENERATE_IMAGE_PROMPT_PLACEHOLDER:
    "A photorealistic close-up of a ceramic coffee mug on a polished concrete surface...",

  // Edit Image tool
  EDIT_IMAGE_DISPLAY_NAME: "Edit Image",
  EDIT_IMAGE_DESCRIPTION:
    "Edit an existing image using a text prompt with Nano Banana.",
  EDIT_IMAGE_PROMPT_DISPLAY_NAME: "Prompt",
  EDIT_IMAGE_PROMPT_AI_DESCRIPTION:
    "Write the full edit instruction for the input image, including what to change, preserve, remove, add, or restyle. Value type: free-form string.",
  EDIT_IMAGE_PROMPT_HINT:
    "Describe the changes to make to the image. Be specific about what to add, remove, or modify.",
  EDIT_IMAGE_PROMPT_PLACEHOLDER: "Add a small wizard hat on the cat's head...",
  EDIT_IMAGE_IMAGE_DISPLAY_NAME: "Input Image",
  EDIT_IMAGE_IMAGE_HINT:
    "The image to edit. Accepts a file_ref input and supports JPEG, PNG, GIF, and WebP formats.",
  EDIT_IMAGE_IMAGE_AI_DESCRIPTION:
    "Write a `file_ref` value pointing to the source image to edit. Supported source image formats include JPEG, PNG, GIF, and WebP. Value type: `file_ref`.",
} satisfies BaseTranslation

export default en_US
