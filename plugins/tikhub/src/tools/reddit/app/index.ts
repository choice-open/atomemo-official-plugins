import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_reddit_comment_replies } from "./fetch-comment-replies"
import { tikhub_reddit_dynamic_search } from "./fetch-dynamic-search"
import { tikhub_reddit_post_comments } from "./fetch-post-comments"
import { tikhub_reddit_post_details } from "./fetch-post-details"
import { tikhub_reddit_subreddit_feed } from "./fetch-subreddit-feed"
import { tikhub_reddit_subreddit_info } from "./fetch-subreddit-info"
import { tikhub_reddit_trending_searches } from "./fetch-trending-searches"
import { tikhub_reddit_user_comments } from "./fetch-user-comments"
import { tikhub_reddit_user_posts } from "./fetch-user-posts"
import { tikhub_reddit_user_profile } from "./fetch-user-profile"

export const redditAppTools: ToolDefinition[] = [
  tikhub_reddit_dynamic_search,
  tikhub_reddit_trending_searches,
  tikhub_reddit_post_details,
  tikhub_reddit_post_comments,
  tikhub_reddit_comment_replies,
  tikhub_reddit_subreddit_info,
  tikhub_reddit_subreddit_feed,
  tikhub_reddit_user_profile,
  tikhub_reddit_user_posts,
  tikhub_reddit_user_comments,
]
