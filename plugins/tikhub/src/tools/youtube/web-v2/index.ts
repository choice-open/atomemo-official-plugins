import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_youtube_channel_videos } from "./get-channel-videos"
import { tikhub_youtube_general_search_v2 } from "./get-general-search-v2"
import { tikhub_youtube_shorts_search_v2 } from "./get-shorts-search-v2"
import { tikhub_youtube_video_captions_v2 } from "./get-video-captions-v2"
import { tikhub_youtube_comment_replies } from "./get-video-comment-replies"
import { tikhub_youtube_video_comments } from "./get-video-comments"
import { tikhub_youtube_video_info_v2 } from "./get-video-info-v2"
import { tikhub_youtube_search_channels } from "./search-channels"

export const youtubeWebV2Tools: ToolDefinition[] = [
  tikhub_youtube_general_search_v2,
  tikhub_youtube_shorts_search_v2,
  tikhub_youtube_video_info_v2,
  tikhub_youtube_video_captions_v2,
  tikhub_youtube_video_comments,
  tikhub_youtube_comment_replies,
  tikhub_youtube_search_channels,
  tikhub_youtube_channel_videos,
]
