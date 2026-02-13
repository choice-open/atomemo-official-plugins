import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "OpenAI",
  PLUGIN_DESCRIPTION: "OpenAI 文本、视觉与推理模型。",

  OPENAI_API_KEY_DISPLAY_NAME: "OpenAI API Key",
  OPENAI_API_KEY_DESCRIPTION: "用于对话补全的 OpenAI API Key",
  OPENAI_API_KEY_HINT: "输入 OpenAI API Key",
  OPENAI_API_KEY_PLACEHOLDER: "sk-...",

  OPENAI_ORGANIZATION_ID_DISPLAY_NAME: "Organization ID",
  OPENAI_ORGANIZATION_ID_DESCRIPTION:
    "可选的 OpenAI 组织 ID，将作为 OpenAI-Organization 请求头发送。",
  OPENAI_ORGANIZATION_ID_HINT: "如需指定组织范围，请填写对应的 Organization ID",
  OPENAI_ORGANIZATION_ID_PLACEHOLDER: "org_...",

  OPENAI_PROJECT_ID_DISPLAY_NAME: "Project ID",
  OPENAI_PROJECT_ID_DESCRIPTION:
    "可选的 OpenAI 项目 ID，将作为 OpenAI-Project 请求头发送。",
  OPENAI_PROJECT_ID_HINT: "如需指定项目范围，请填写对应的 Project ID",
  OPENAI_PROJECT_ID_PLACEHOLDER: "proj_...",

  OPENAI_GPT_5_2_DISPLAY_NAME: "GPT-5.2",
  OPENAI_GPT_5_2_DESCRIPTION:
    "用于编码和智能体的 GPT-5.2 前沿模型（Chat Completions）。",

  OPENAI_GPT_5_2_PRO_DISPLAY_NAME: "GPT-5.2 pro",
  OPENAI_GPT_5_2_PRO_DESCRIPTION: "精度更高、适合复杂任务的 GPT-5.2 Pro 模型。",

  OPENAI_GPT_5_2_CODEX_DISPLAY_NAME: "GPT-5.2 Codex",
  OPENAI_GPT_5_2_CODEX_DESCRIPTION:
    "针对软件工程与编码智能体优化的 GPT-5.2 Codex 模型。",

  OPENAI_GPT_5_1_DISPLAY_NAME: "GPT-5.1",
  OPENAI_GPT_5_1_DESCRIPTION: "用于通用推理、编码和智能体的 GPT-5.1 模型。",

  OPENAI_GPT_5_1_CODEX_DISPLAY_NAME: "GPT-5.1 Codex",
  OPENAI_GPT_5_1_CODEX_DESCRIPTION: "针对编码工作流优化的 GPT-5.1 Codex 模型。",

  OPENAI_GPT_5_1_CODEX_MAX_DISPLAY_NAME: "GPT-5.1 Codex Max",
  OPENAI_GPT_5_1_CODEX_MAX_DESCRIPTION:
    "面向长时间、大规模编码任务的 GPT-5.1 Codex Max 模型。",

  OPENAI_GPT_5_DISPLAY_NAME: "GPT-5",
  OPENAI_GPT_5_DESCRIPTION: "用于编码、智能体和通用任务的 GPT-5 推理模型。",

  OPENAI_GPT_5_PRO_DISPLAY_NAME: "GPT-5 pro",
  OPENAI_GPT_5_PRO_DESCRIPTION: "精度更高、更可靠的 GPT-5 Pro 模型。",

  OPENAI_GPT_5_CODEX_DISPLAY_NAME: "GPT-5 Codex",
  OPENAI_GPT_5_CODEX_DESCRIPTION: "针对代码生成和重构优化的 GPT-5 Codex 模型。",

  OPENAI_GPT_5_MINI_DISPLAY_NAME: "GPT-5 mini",
  OPENAI_GPT_5_MINI_DESCRIPTION: "更快、更省、适合日常任务的 GPT-5 mini 模型。",

  OPENAI_GPT_5_NANO_DISPLAY_NAME: "GPT-5 nano",
  OPENAI_GPT_5_NANO_DESCRIPTION:
    "延迟最低、最省成本的 GPT-5 nano 模型，适合实时场景。",

  OPENAI_GPT_4O_DISPLAY_NAME: "GPT-4o",
  OPENAI_GPT_4O_DESCRIPTION: "能力最强的 GPT-4o 模型",
  OPENAI_GPT_4O_MINI_DISPLAY_NAME: "GPT-4o mini",
  OPENAI_GPT_4O_MINI_DESCRIPTION: "快速且经济的小型模型",
  OPENAI_GPT_4O_NANO_DISPLAY_NAME: "GPT-4o nano",
  OPENAI_GPT_4O_NANO_DESCRIPTION:
    "超快、超省、适合轻量级任务的 GPT-4o nano 模型。",

  OPENAI_GPT_4_1_DISPLAY_NAME: "GPT-4.1",
  OPENAI_GPT_4_1_DESCRIPTION: "面向长上下文推理、编码和检索的 GPT-4.1 模型。",
  OPENAI_GPT_4_1_MINI_DISPLAY_NAME: "GPT-4.1 mini",
  OPENAI_GPT_4_1_MINI_DESCRIPTION:
    "延迟更低、成本更优且具备较强推理与编码能力的 GPT-4.1 mini 模型。",

  OPENAI_O1_DISPLAY_NAME: "O1",
  OPENAI_O1_DESCRIPTION: "高级推理模型",
  OPENAI_O1_MINI_DISPLAY_NAME: "O1 mini",
  OPENAI_O1_MINI_DESCRIPTION: "高效推理模型",

  OPENAI_GPT_REALTIME_DISPLAY_NAME: "gpt-realtime",
  OPENAI_GPT_REALTIME_DESCRIPTION: "用于低延迟流式交互的 Realtime GPT 模型。",
  OPENAI_GPT_REALTIME_MINI_DISPLAY_NAME: "gpt-realtime-mini",
  OPENAI_GPT_REALTIME_MINI_DESCRIPTION:
    "为成本敏感的流式场景优化的 Realtime mini GPT 模型。",

  OPENAI_GPT_AUDIO_DISPLAY_NAME: "gpt-audio",
  OPENAI_GPT_AUDIO_DESCRIPTION: "支持文本与音频交互的 GPT audio 模型。",
  OPENAI_GPT_AUDIO_MINI_DISPLAY_NAME: "gpt-audio-mini",
  OPENAI_GPT_AUDIO_MINI_DESCRIPTION:
    "面向音频任务的高性价比 GPT audio mini 模型。",
} satisfies Translation

export default zh_Hans
