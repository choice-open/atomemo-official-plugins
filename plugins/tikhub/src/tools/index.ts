import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { douyinAppV3Tools } from "./douyin/app-v3"
import { douyinSearchTools } from "./douyin/search"
import { linkedinWebTools } from "./linkedin/web"
import { tiktokAppV3Tools } from "./tiktok/app-v3"
import { xiaohongshuAppV2Tools } from "./xiaohongshu/app-v2"

export const allTools: ToolDefinition[] = [
  ...xiaohongshuAppV2Tools,
  ...linkedinWebTools,
  ...douyinSearchTools,
  ...douyinAppV3Tools,
  ...tiktokAppV3Tools,
]
