import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { tikhub_twitter_latest_comments } from "./fetch-latest-post-comments"
import { tikhub_twitter_post_comments } from "./fetch-post-comments"
import { tikhub_twitter_retweet_users } from "./fetch-retweet-user-list"
import { tikhub_twitter_search_timeline } from "./fetch-search-timeline"
import { tikhub_twitter_trending } from "./fetch-trending"
import { tikhub_twitter_tweet_detail } from "./fetch-tweet-detail"
import { tikhub_twitter_user_followers } from "./fetch-user-followers"
import { tikhub_twitter_user_followings } from "./fetch-user-followings"
import { tikhub_twitter_user_media } from "./fetch-user-media"
import { tikhub_twitter_user_posts } from "./fetch-user-post-tweet"
import { tikhub_twitter_user_profile } from "./fetch-user-profile"
import { tikhub_twitter_user_replies } from "./fetch-user-tweet-replies"

export const twitterWebTools: ToolDefinition[] = [
  tikhub_twitter_search_timeline,
  tikhub_twitter_tweet_detail,
  tikhub_twitter_post_comments,
  tikhub_twitter_latest_comments,
  tikhub_twitter_user_profile,
  tikhub_twitter_user_posts,
  tikhub_twitter_user_replies,
  tikhub_twitter_trending,
  tikhub_twitter_retweet_users,
  tikhub_twitter_user_media,
  tikhub_twitter_user_followers,
  tikhub_twitter_user_followings,
]
