import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_youtube_channel_info } from "./get-channel-info"
import { tikhub_youtube_trending_videos } from "./get-trending-videos"

export const youtubeWebTools: ToolDefinition[] = [
  tikhub_youtube_channel_info,
  tikhub_youtube_trending_videos,
]
