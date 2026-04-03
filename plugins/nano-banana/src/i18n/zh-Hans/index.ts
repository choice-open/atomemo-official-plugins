import type { Translation } from "../i18n-types"

const zh_Hans = {
  // Plugin
  PLUGIN_DISPLAY_NAME: "Nano Banana 图像工作室",
  PLUGIN_DESCRIPTION:
    "使用 Google Gemini 图像模型生成和编辑图像，包括 Nano Banana 和 Nano Banana Pro。",

  // Credential
  CREDENTIAL_DISPLAY_NAME: "Gemini API 密钥",
  CREDENTIAL_DESCRIPTION: "用于鉴权 Google Gemini API 请求的 API 密钥。",
  CREDENTIAL_API_KEY_DISPLAY_NAME: "Gemini API 密钥",
  CREDENTIAL_API_KEY_HINT: "粘贴来自 Google AI Studio 的 Gemini API 密钥。",
  CREDENTIAL_API_KEY_PLACEHOLDER: "AIza...",
  CREDENTIAL_BASE_URL_DISPLAY_NAME: "Base URL",
  CREDENTIAL_BASE_URL_HINT:
    "可选的 Gemini 兼容端点。如果不提供，将使用 Google 官方端点。",
  CREDENTIAL_BASE_URL_PLACEHOLDER: "https://your-proxy.example.com",

  // Shared parameters
  PARAM_CREDENTIAL_DISPLAY_NAME: "Gemini 凭据",
  PARAM_CREDENTIAL_AI_DESCRIPTION:
    "凭据 ID 字符串，引用已配置的 `gemini-api-key` 凭据。填写所选凭据的 ID 值。",
  PARAM_MODEL_DISPLAY_NAME: "模型",
  PARAM_MODEL_HINT: "选择要使用的 Nano Banana 模型。",
  PARAM_MODEL_AI_DESCRIPTION:
    "`gemini-3.1-flash-image-preview` 支持这个工具里最完整的参数集合，包括 thinking、Google 搜索增强、`512` 分辨率以及额外宽高比 `1:4`、`4:1`、`1:8`、`8:1`。`gemini-3-pro-image-preview` 不使用 thinking，也不支持 `512` 和这些额外宽高比。`gemini-2.5-flash-image` 在当前实现中会忽略 `resolution`、`thinking_level`、`include_thoughts`、`enable_search_grounding`。可写值：`gemini-3.1-flash-image-preview`、`gemini-3-pro-image-preview`、`gemini-2.5-flash-image`。",
  PARAM_MODEL_OPTION_GEMINI_31_FLASH_IMAGE: "Nano Banana 2（3.1 Flash Image）",
  PARAM_MODEL_OPTION_GEMINI_3_PRO_IMAGE: "Nano Banana Pro（3 Pro Image）",
  PARAM_MODEL_OPTION_GEMINI_25_FLASH_IMAGE: "Nano Banana（2.5 Flash Image）",
  PARAM_ASPECT_RATIO_DISPLAY_NAME: "宽高比",
  PARAM_ASPECT_RATIO_HINT: "生成图像的宽高比。",
  PARAM_ASPECT_RATIO_AI_DESCRIPTION:
    "基础宽高比 `1:1`、`2:3`、`3:2`、`3:4`、`4:3`、`4:5`、`5:4`、`9:16`、`16:9`、`21:9` 会被广泛支持。额外宽高比 `1:4`、`4:1`、`1:8`、`8:1` 仅会在 `gemini-3.1-flash-image-preview` 上生效。可写值：`1:1`、`16:9`、`9:16`、`4:3`、`3:4`、`3:2`、`2:3`、`5:4`、`4:5`、`21:9`、`4:1`、`1:4`、`8:1`、`1:8`。",
  PARAM_ASPECT_RATIO_OPTION_1_1: "1:1（方形）",
  PARAM_ASPECT_RATIO_OPTION_16_9: "16:9（横向）",
  PARAM_ASPECT_RATIO_OPTION_9_16: "9:16（纵向）",
  PARAM_ASPECT_RATIO_OPTION_4_3: "4:3（标准）",
  PARAM_ASPECT_RATIO_OPTION_3_4: "3:4（纵向）",
  PARAM_ASPECT_RATIO_OPTION_3_2: "3:2（照片）",
  PARAM_ASPECT_RATIO_OPTION_2_3: "2:3（纵向照片）",
  PARAM_ASPECT_RATIO_OPTION_5_4: "5:4（大画幅）",
  PARAM_ASPECT_RATIO_OPTION_4_5: "4:5（纵向大画幅）",
  PARAM_ASPECT_RATIO_OPTION_21_9: "21:9（超宽）",
  PARAM_ASPECT_RATIO_OPTION_4_1: "4:1（横幅，仅 NB2）",
  PARAM_ASPECT_RATIO_OPTION_1_4: "1:4（竖幅横幅，仅 NB2）",
  PARAM_ASPECT_RATIO_OPTION_8_1: "8:1（超宽横幅，仅 NB2）",
  PARAM_ASPECT_RATIO_OPTION_1_8: "1:8（超高竖幅，仅 NB2）",
  PARAM_RESOLUTION_DISPLAY_NAME: "分辨率",
  PARAM_RESOLUTION_HINT: "生成图像的输出分辨率。",
  PARAM_RESOLUTION_AI_DESCRIPTION:
    "`gemini-3.1-flash-image-preview` 支持 `512`、`1K`、`2K`、`4K`。`gemini-3-pro-image-preview` 仅支持 `1K`、`2K`、`4K`。`gemini-2.5-flash-image` 会忽略这个参数。可写值：`512`、`1K`、`2K`、`4K`。",
  PARAM_RESOLUTION_OPTION_512: "512（0.5K，仅 NB2）",
  PARAM_RESOLUTION_OPTION_1K: "1K（默认）",
  PARAM_RESOLUTION_OPTION_2K: "2K（高清）",
  PARAM_RESOLUTION_OPTION_4K: "4K（超高清）",
  PARAM_THINKING_LEVEL_DISPLAY_NAME: "思考级别",
  PARAM_THINKING_LEVEL_HINT:
    "控制推理深度。「高」可以提升复杂提示的生成质量，但会增加延迟。仅影响 Nano Banana 2。",
  PARAM_THINKING_LEVEL_AI_DESCRIPTION:
    "该参数仅对 `gemini-3.1-flash-image-preview` 生效；其他模型会忽略它。可写值：`minimal`、`high`。",
  PARAM_THINKING_LEVEL_OPTION_MINIMAL: "最低（更快）",
  PARAM_THINKING_LEVEL_OPTION_HIGH: "高（更好质量）",
  PARAM_INCLUDE_THOUGHTS_DISPLAY_NAME: "返回思考内容",
  PARAM_INCLUDE_THOUGHTS_HINT:
    "启用后，会在工具响应中返回模型的思考摘要。无论是否启用，思考令牌的计费都仍然可能发生。",
  PARAM_INCLUDE_THOUGHTS_AI_DESCRIPTION:
    "`true` 表示在支持 thinking 时返回模型的思考摘要，`false` 表示隐藏思考摘要。该参数仅对 `gemini-3.1-flash-image-preview` 生效；其他模型会忽略它。这个开关只控制可见性，不保证关闭后就不会产生或计费 thinking token。可写值：`true`、`false`。",
  PARAM_ENABLE_SEARCH_DISPLAY_NAME: "Google 搜索增强",
  PARAM_ENABLE_SEARCH_HINT: "启用 Google 搜索以基于实时信息生成图像。",
  PARAM_ENABLE_SEARCH_AI_DESCRIPTION:
    "`true` 表示启用 Google 搜索增强，用于依赖实时信息或外部事实信息的提示；`false` 表示禁用。该参数仅对 `gemini-3.1-flash-image-preview` 和 `gemini-3-pro-image-preview` 生效；`gemini-2.5-flash-image` 会忽略它。可写值：`true`、`false`。",
  PARAM_OUTPUT_STORAGE_DISPLAY_NAME: "上传至存储",
  PARAM_OUTPUT_STORAGE_HINT:
    "启用时，将生成的图像上传到持久化对象存储。禁用时，在内存中返回图像。",
  PARAM_OUTPUT_STORAGE_AI_DESCRIPTION:
    "`true` 表示将生成图像上传到持久化存储；`false` 表示仅以内存文件引用形式返回。可写值：`true`、`false`。",

  // Generate Image tool
  GENERATE_IMAGE_DISPLAY_NAME: "生成图像",
  GENERATE_IMAGE_DESCRIPTION: "使用 Nano Banana 从文本提示生成图像。",
  GENERATE_IMAGE_PROMPT_DISPLAY_NAME: "提示词",
  GENERATE_IMAGE_PROMPT_AI_DESCRIPTION:
    "填写完整的图像生成提示词，描述场景、主体、构图、风格、光照、需要渲染的文字以及重要约束。值类型：自由文本字符串。",
  GENERATE_IMAGE_PROMPT_HINT:
    "描述您想要生成的图像。具体说明风格、光照、构图和细节。",
  GENERATE_IMAGE_PROMPT_PLACEHOLDER:
    "一张写实风格的陶瓷咖啡杯特写，放在抛光混凝土台面上...",

  // Edit Image tool
  EDIT_IMAGE_DISPLAY_NAME: "编辑图像",
  EDIT_IMAGE_DESCRIPTION: "使用 Nano Banana 通过文本提示编辑现有图像。",
  EDIT_IMAGE_PROMPT_DISPLAY_NAME: "提示词",
  EDIT_IMAGE_PROMPT_AI_DESCRIPTION:
    "填写完整的图像编辑指令，说明要修改、保留、删除、添加或重塑风格的内容。值类型：自由文本字符串。",
  EDIT_IMAGE_PROMPT_HINT:
    "描述要对图像进行的更改。具体说明要添加、删除或修改的内容。",
  EDIT_IMAGE_PROMPT_PLACEHOLDER: "在猫头上添加一顶小巫师帽...",
  EDIT_IMAGE_IMAGE_DISPLAY_NAME: "输入图像",
  EDIT_IMAGE_IMAGE_HINT:
    "要编辑的图像。接受 file_ref 输入，支持 JPEG、PNG、GIF 和 WebP 格式。",
  EDIT_IMAGE_IMAGE_AI_DESCRIPTION:
    "填写一个指向源图像的 `file_ref` 值。支持的源图像格式包括 JPEG、PNG、GIF、WebP。值类型：`file_ref`。",
} satisfies Translation

export default zh_Hans
