import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_bilibili_comment_replies } from "./fetch-comment-reply"
import { tikhub_bilibili_general_search } from "./fetch-general-search"
import { tikhub_bilibili_video_details } from "./fetch-one-video"
import { tikhub_bilibili_user_dynamics } from "./fetch-user-dynamic"
import { tikhub_bilibili_user_videos } from "./fetch-user-post-videos"
import { tikhub_bilibili_user_profile } from "./fetch-user-profile"
import { tikhub_bilibili_user_relation_stats } from "./fetch-user-relation-stat"
import { tikhub_bilibili_user_up_stats } from "./fetch-user-up-stat"
import { tikhub_bilibili_video_comments } from "./fetch-video-comments"
import { tikhub_bilibili_video_danmaku } from "./fetch-video-danmaku"
import { tikhub_bilibili_video_subtitles } from "./fetch-video-subtitle"

export const bilibiliWebTools: ToolDefinition[] = [
  tikhub_bilibili_general_search,
  tikhub_bilibili_video_details,
  tikhub_bilibili_video_subtitles,
  tikhub_bilibili_video_comments,
  tikhub_bilibili_comment_replies,
  tikhub_bilibili_video_danmaku,
  tikhub_bilibili_user_profile,
  tikhub_bilibili_user_videos,
  tikhub_bilibili_user_dynamics,
  tikhub_bilibili_user_up_stats,
  tikhub_bilibili_user_relation_stats,
]
