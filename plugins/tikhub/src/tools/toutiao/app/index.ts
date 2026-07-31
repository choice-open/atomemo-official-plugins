import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_toutiao_article_info } from "./get-article-info"
import { tikhub_toutiao_post_comments } from "./get-comments"
import { tikhub_toutiao_user_id_from_profile } from "./get-user-id"
import { tikhub_toutiao_user_info } from "./get-user-info"
import { tikhub_toutiao_video_info } from "./get-video-info"

export const toutiaoAppTools: ToolDefinition[] = [
  tikhub_toutiao_article_info,
  tikhub_toutiao_video_info,
  tikhub_toutiao_post_comments,
  tikhub_toutiao_user_id_from_profile,
  tikhub_toutiao_user_info,
]
