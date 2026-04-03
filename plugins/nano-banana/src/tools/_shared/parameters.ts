import type { Property } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { GEMINI_3_1_FLASH_IMAGE_PREVIEW, GEMINI_3_PRO_IMAGE_PREVIEW, GEMINI_2_5_FLASH_IMAGE } from "./constants"

export const credentialParam = {
  name: "credentialId",
  type: "credential_id",
  credential_name: "gemini-api-key",
  required: true,
  display_name: t("PARAM_CREDENTIAL_DISPLAY_NAME"),
  ai: {
    llm_description: t("PARAM_CREDENTIAL_AI_DESCRIPTION"),
  },
  ui: {
    component: "credential-select",
    support_expression: true,
    width: "full",
  },
} satisfies Property

const modelParam = {
  name: "model",
  type: "string",
  required: true,
  default: "gemini-3.1-flash-image-preview",
  display_name: t("PARAM_MODEL_DISPLAY_NAME"),
  ai: {
    llm_description: t("PARAM_MODEL_AI_DESCRIPTION"),
  },
  ui: {
    component: "select",
    hint: t("PARAM_MODEL_HINT"),
    support_expression: true,
    width: "full",
    options: [
      {
        value: GEMINI_3_1_FLASH_IMAGE_PREVIEW,
        label: t("PARAM_MODEL_OPTION_GEMINI_31_FLASH_IMAGE"),
      },
      {
        value: GEMINI_3_PRO_IMAGE_PREVIEW,
        label: t("PARAM_MODEL_OPTION_GEMINI_3_PRO_IMAGE"),
      },
      {
        value: GEMINI_2_5_FLASH_IMAGE,
        label: t("PARAM_MODEL_OPTION_GEMINI_25_FLASH_IMAGE"),
      },
    ],
  },
} satisfies Property

const aspectRatioParam = {
  name: "aspect_ratio",
  type: "string",
  required: false,
  default: "1:1",
  display_name: t("PARAM_ASPECT_RATIO_DISPLAY_NAME"),
  ai: {
    llm_description: t("PARAM_ASPECT_RATIO_AI_DESCRIPTION"),
  },
  ui: {
    component: "select",
    hint: t("PARAM_ASPECT_RATIO_HINT"),
    support_expression: true,
    width: "medium",
    options: [
      {
        value: "1:1",
        label: t("PARAM_ASPECT_RATIO_OPTION_1_1"),
      },
      {
        value: "16:9",
        label: t("PARAM_ASPECT_RATIO_OPTION_16_9"),
      },
      {
        value: "9:16",
        label: t("PARAM_ASPECT_RATIO_OPTION_9_16"),
      },
      {
        value: "4:3",
        label: t("PARAM_ASPECT_RATIO_OPTION_4_3"),
      },
      {
        value: "3:4",
        label: t("PARAM_ASPECT_RATIO_OPTION_3_4"),
      },
      { value: "3:2", label: t("PARAM_ASPECT_RATIO_OPTION_3_2") },
      {
        value: "2:3",
        label: t("PARAM_ASPECT_RATIO_OPTION_2_3"),
      },
      {
        value: "5:4",
        label: t("PARAM_ASPECT_RATIO_OPTION_5_4"),
      },
      {
        value: "4:5",
        label: t("PARAM_ASPECT_RATIO_OPTION_4_5"),
      },
      {
        value: "21:9",
        label: t("PARAM_ASPECT_RATIO_OPTION_21_9"),
      },
      {
        value: "4:1",
        label: t("PARAM_ASPECT_RATIO_OPTION_4_1"),
      },
      {
        value: "1:4",
        label: t("PARAM_ASPECT_RATIO_OPTION_1_4"),
      },
      {
        value: "8:1",
        label: t("PARAM_ASPECT_RATIO_OPTION_8_1"),
      },
      {
        value: "1:8",
        label: t("PARAM_ASPECT_RATIO_OPTION_1_8"),
      },
    ],
  },
} satisfies Property

const resolutionParam = {
  name: "resolution",
  type: "string",
  required: false,
  default: "1K",
  display_name: t("PARAM_RESOLUTION_DISPLAY_NAME"),
  display: {
    hide: {
      model: GEMINI_2_5_FLASH_IMAGE,
    },
  },
  ai: {
    llm_description: t("PARAM_RESOLUTION_AI_DESCRIPTION"),
  },
  ui: {
    component: "select",
    hint: t("PARAM_RESOLUTION_HINT"),
    support_expression: true,
    width: "medium",
    options: [
      {
        value: "512",
        label: t("PARAM_RESOLUTION_OPTION_512"),
      },
      { value: "1K", label: t("PARAM_RESOLUTION_OPTION_1K") },
      { value: "2K", label: t("PARAM_RESOLUTION_OPTION_2K") },
      {
        value: "4K",
        label: t("PARAM_RESOLUTION_OPTION_4K"),
      },
    ],
  },
} satisfies Property

const thinkingLevelParam = {
  name: "thinking_level",
  type: "string",
  required: false,
  default: "minimal",
  display_name: t("PARAM_THINKING_LEVEL_DISPLAY_NAME"),
  display: {
    hide: {
      model: {
        $in: [GEMINI_3_PRO_IMAGE_PREVIEW, GEMINI_2_5_FLASH_IMAGE],
      },
    },
  },
  ai: {
    llm_description: t("PARAM_THINKING_LEVEL_AI_DESCRIPTION"),
  },
  ui: {
    component: "select",
    hint: t("PARAM_THINKING_LEVEL_HINT"),
    support_expression: true,
    width: "medium",
    options: [
      {
        value: "minimal",
        label: t("PARAM_THINKING_LEVEL_OPTION_MINIMAL"),
      },
      {
        value: "high",
        label: t("PARAM_THINKING_LEVEL_OPTION_HIGH"),
      },
    ],
  },
} satisfies Property

const includeThoughtsParam = {
  name: "include_thoughts",
  type: "boolean",
  required: false,
  default: false,
  display_name: t("PARAM_INCLUDE_THOUGHTS_DISPLAY_NAME"),
  display: {
    hide: {
      model: {
        $in: [GEMINI_3_PRO_IMAGE_PREVIEW, GEMINI_2_5_FLASH_IMAGE],
      },
    },
  },
  ai: {
    llm_description: t("PARAM_INCLUDE_THOUGHTS_AI_DESCRIPTION"),
  },
  ui: {
    component: "switch",
    hint: t("PARAM_INCLUDE_THOUGHTS_HINT"),
    support_expression: true,
    width: "full",
  },
} satisfies Property

const enableSearchParam = {
  name: "enable_search_grounding",
  type: "boolean",
  required: false,
  default: false,
  display_name: t("PARAM_ENABLE_SEARCH_DISPLAY_NAME"),
  display: {
    hide: {
      model: GEMINI_2_5_FLASH_IMAGE,
    },
  },
  ai: {
    llm_description: t("PARAM_ENABLE_SEARCH_AI_DESCRIPTION"),
  },
  ui: {
    component: "switch",
    hint: t("PARAM_ENABLE_SEARCH_HINT"),
    support_expression: true,
    width: "full",
  },
} satisfies Property

const outputStorageParam = {
  name: "upload_to_storage",
  type: "boolean",
  required: false,
  default: true,
  display_name: t("PARAM_OUTPUT_STORAGE_DISPLAY_NAME"),
  ai: {
    llm_description: t("PARAM_OUTPUT_STORAGE_AI_DESCRIPTION"),
  },
  ui: {
    component: "switch",
    hint: t("PARAM_OUTPUT_STORAGE_HINT"),
    support_expression: true,
    width: "full",
  },
} satisfies Property

export const sharedParams = [
  modelParam,
  aspectRatioParam,
  resolutionParam,
  thinkingLevelParam,
  includeThoughtsParam,
  enableSearchParam,
  outputStorageParam,
]
