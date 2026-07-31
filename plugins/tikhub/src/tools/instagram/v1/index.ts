import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_instagram_comment_replies } from "./fetch-comment-replies"
import { tikhub_instagram_hashtag_posts } from "./fetch-hashtag-posts"
import { tikhub_instagram_post_by_id } from "./fetch-post-by-id"
import { tikhub_instagram_post_by_url } from "./fetch-post-by-url"
import { tikhub_instagram_post_comments } from "./fetch-post-comments"
import { tikhub_instagram_search } from "./fetch-search"
import { tikhub_instagram_user_posts } from "./fetch-user-posts"
import { tikhub_instagram_user_profile } from "./fetch-user-profile"
import { tikhub_instagram_user_reels } from "./fetch-user-reels"
import { tikhub_instagram_user_tagged_posts } from "./fetch-user-tagged-posts"

export const instagramV1Tools: ToolDefinition[] = [
  tikhub_instagram_search,
  tikhub_instagram_hashtag_posts,
  tikhub_instagram_post_by_url,
  tikhub_instagram_post_by_id,
  tikhub_instagram_post_comments,
  tikhub_instagram_comment_replies,
  tikhub_instagram_user_profile,
  tikhub_instagram_user_posts,
  tikhub_instagram_user_reels,
  tikhub_instagram_user_tagged_posts,
]
