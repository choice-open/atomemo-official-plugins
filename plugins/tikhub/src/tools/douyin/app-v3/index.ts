import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_douyin_fetch_one_video_v3 } from "./fetch-one-video-v3"
import { tikhub_douyin_fetch_multi_video_v2 } from "./fetch-multi-video-v2"
import { tikhub_douyin_fetch_one_video_by_share_url } from "./fetch-one-video-by-share-url"
import { tikhub_douyin_fetch_video_statistics } from "./fetch-video-statistics"
import { tikhub_douyin_fetch_multi_video_statistics } from "./fetch-multi-video-statistics"
import { tikhub_douyin_fetch_video_comments } from "./fetch-video-comments"
import { tikhub_douyin_fetch_video_comment_replies } from "./fetch-video-comment-replies"

export const douyinAppV3Tools: ToolDefinition[] = [
  tikhub_douyin_fetch_one_video_v3,
  tikhub_douyin_fetch_multi_video_v2,
  tikhub_douyin_fetch_one_video_by_share_url,
  tikhub_douyin_fetch_video_statistics,
  tikhub_douyin_fetch_multi_video_statistics,
  tikhub_douyin_fetch_video_comments,
  tikhub_douyin_fetch_video_comment_replies,
]
