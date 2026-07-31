import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_wechat_mp_account_articles } from "./fetch-account-articles"
import { tikhub_wechat_mp_account_profile } from "./fetch-account-profile"
import { tikhub_wechat_mp_article_comments } from "./fetch-article-comments"
import { tikhub_wechat_mp_article_detail } from "./fetch-article-detail"
import { tikhub_wechat_mp_article_stats } from "./fetch-article-stats"
import { tikhub_wechat_mp_comment_replies } from "./fetch-comment-replies"

export const wechatMediaPlatformV2Tools: ToolDefinition[] = [
  tikhub_wechat_mp_account_profile,
  tikhub_wechat_mp_account_articles,
  tikhub_wechat_mp_article_detail,
  tikhub_wechat_mp_article_stats,
  tikhub_wechat_mp_article_comments,
  tikhub_wechat_mp_comment_replies,
]
