import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "JSON 读取器",
  PLUGIN_DESCRIPTION: "读取文件并解析为 JSON 对象，支持 BOM 头",
  READ_JSON_TOOL_DISPLAY_NAME: "读取 JSON",
  READ_JSON_TOOL_DESCRIPTION:
    "将文件解析为 JSON 对象，自动处理 BOM 头和编码检测。",
  FILE_DISPLAY_NAME: "文件",
  FILE_HINT: "要解析为 JSON 的文件",
} satisfies Translation

export default zh_Hans
