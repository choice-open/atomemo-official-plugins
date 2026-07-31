import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_kuaishou_comment_replies } from "./fetch-comment-replies"
import { tikhub_kuaishou_hot_board_categories } from "./fetch-hot-board-categories"
import { tikhub_kuaishou_hot_board_details } from "./fetch-hot-board-details"
import { tikhub_kuaishou_tag_feed } from "./fetch-tag-feed"
import { tikhub_kuaishou_user_profile } from "./fetch-user-profile"
import { tikhub_kuaishou_user_videos } from "./fetch-user-videos"
import { tikhub_kuaishou_video_comments } from "./fetch-video-comments"
import { tikhub_kuaishou_video_details_by_url } from "./fetch-video-details-by-url"
import { tikhub_kuaishou_tag_search } from "./search-tag"
import { tikhub_kuaishou_user_search } from "./search-user"
import { tikhub_kuaishou_video_search } from "./search-video"

export const kuaishouAppTools: ToolDefinition[] = [
  tikhub_kuaishou_video_search,
  tikhub_kuaishou_user_search,
  tikhub_kuaishou_tag_search,
  tikhub_kuaishou_tag_feed,
  tikhub_kuaishou_video_details_by_url,
  tikhub_kuaishou_video_comments,
  tikhub_kuaishou_comment_replies,
  tikhub_kuaishou_user_profile,
  tikhub_kuaishou_user_videos,
  tikhub_kuaishou_hot_board_categories,
  tikhub_kuaishou_hot_board_details,
]
