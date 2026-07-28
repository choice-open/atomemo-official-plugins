import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_tiktok_fetch_general_search_result } from "./fetch-general-search-result"
import { tikhub_tiktok_fetch_hashtag_search_result } from "./fetch-hashtag-search-result"
import { tikhub_tiktok_fetch_multi_video_v2 } from "./fetch-multi-video-v2"
import { tikhub_tiktok_fetch_music_search_result } from "./fetch-music-search-result"
import { tikhub_tiktok_fetch_one_video_by_share_url_v2 } from "./fetch-one-video-by-share-url-v2"
import { tikhub_tiktok_fetch_one_video_v3 } from "./fetch-one-video-v3"
import { tikhub_tiktok_fetch_user_post_videos_v3 } from "./fetch-user-post-videos-v3"
import { tikhub_tiktok_fetch_user_search_result } from "./fetch-user-search-result"
import { tikhub_tiktok_fetch_video_comment_replies } from "./fetch-video-comment-replies"
import { tikhub_tiktok_fetch_video_comments } from "./fetch-video-comments"
import { tikhub_tiktok_fetch_video_search_result } from "./fetch-video-search-result"

export const tiktokAppV3Tools: ToolDefinition[] = [
  tikhub_tiktok_fetch_one_video_v3,
  tikhub_tiktok_fetch_multi_video_v2,
  tikhub_tiktok_fetch_one_video_by_share_url_v2,
  tikhub_tiktok_fetch_user_post_videos_v3,
  tikhub_tiktok_fetch_video_comments,
  tikhub_tiktok_fetch_video_comment_replies,
  tikhub_tiktok_fetch_general_search_result,
  tikhub_tiktok_fetch_video_search_result,
  tikhub_tiktok_fetch_user_search_result,
  tikhub_tiktok_fetch_music_search_result,
  tikhub_tiktok_fetch_hashtag_search_result,
]
