import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_douyin_fetch_general_search_v2 } from "./fetch-general-search-v2"
import { tikhub_douyin_fetch_video_search_v2 } from "./fetch-video-search-v2"
import { tikhub_douyin_fetch_multi_search } from "./fetch-multi-search"
import { tikhub_douyin_fetch_user_search_v2 } from "./fetch-user-search-v2"
import { tikhub_douyin_fetch_image_search } from "./fetch-image-search"
import { tikhub_douyin_fetch_image_search_v3 } from "./fetch-image-search-v3"
import { tikhub_douyin_fetch_live_search_v1 } from "./fetch-live-search-v1"
import { tikhub_douyin_fetch_challenge_search_v2 } from "./fetch-challenge-search-v2"
import { tikhub_douyin_fetch_experience_search } from "./fetch-experience-search"
import { tikhub_douyin_fetch_music_search } from "./fetch-music-search"
import { tikhub_douyin_fetch_discuss_search } from "./fetch-discuss-search"

export const douyinSearchTools: ToolDefinition[] = [
  tikhub_douyin_fetch_general_search_v2,
  tikhub_douyin_fetch_video_search_v2,
  tikhub_douyin_fetch_multi_search,
  tikhub_douyin_fetch_user_search_v2,
  tikhub_douyin_fetch_image_search,
  tikhub_douyin_fetch_image_search_v3,
  tikhub_douyin_fetch_live_search_v1,
  tikhub_douyin_fetch_challenge_search_v2,
  tikhub_douyin_fetch_experience_search,
  tikhub_douyin_fetch_music_search,
  tikhub_douyin_fetch_discuss_search,
]
