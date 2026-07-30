import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_wechat_channels_resolve_username } from "./fetch-channel-id-to-username"
import { tikhub_wechat_channels_user_profile } from "./fetch-user-profile"
import { tikhub_wechat_channels_user_videos } from "./fetch-user-videos"
import { tikhub_wechat_channels_comments } from "./fetch-video-comments"
import { tikhub_wechat_channels_video_detail } from "./fetch-video-detail"

export const wechatChannelsV2Tools: ToolDefinition[] = [
  tikhub_wechat_channels_video_detail,
  tikhub_wechat_channels_comments,
  tikhub_wechat_channels_resolve_username,
  tikhub_wechat_channels_user_profile,
  tikhub_wechat_channels_user_videos,
]
