import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { xiaohongshuAppV2Tools } from "./xiaohongshu/app-v2"
import { linkedinWebTools } from "./linkedin/web"
import { douyinSearchTools } from "./douyin/search"
import { douyinAppV3Tools } from "./douyin/app-v3"

export const allTools: ToolDefinition[] = [
  ...xiaohongshuAppV2Tools,
  ...linkedinWebTools,
  ...douyinSearchTools,
  ...douyinAppV3Tools,
]
