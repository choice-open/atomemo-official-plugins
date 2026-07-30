import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_weibo_advanced_search } from "./fetch-advanced-search"
import { tikhub_weibo_hot_search_summary } from "./fetch-hot-search-summary"
import { tikhub_weibo_post_comments } from "./fetch-post-comments"
import { tikhub_weibo_post_detail } from "./fetch-post-detail"
import { tikhub_weibo_post_sub_comments } from "./fetch-post-sub-comments"
import { tikhub_weibo_realtime_search } from "./fetch-realtime-search"
import { tikhub_weibo_user_info } from "./fetch-user-info"
import { tikhub_weibo_user_posts } from "./fetch-user-posts"
import { tikhub_weibo_user_search } from "./fetch-user-search"

export const weiboWebV2Tools: ToolDefinition[] = [
  tikhub_weibo_advanced_search,
  tikhub_weibo_realtime_search,
  tikhub_weibo_hot_search_summary,
  tikhub_weibo_post_detail,
  tikhub_weibo_post_comments,
  tikhub_weibo_post_sub_comments,
  tikhub_weibo_user_search,
  tikhub_weibo_user_info,
  tikhub_weibo_user_posts,
]
