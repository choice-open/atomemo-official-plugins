# Twitter-Web-API

TikHub Twitter-Web tools expose raw X/Twitter JSON responses for search,
tweet detail, comments, author profiles, retweet propagation, and account
network analysis. The tools do not normalize, score, persist, or perform
sentiment analysis in this release.

## 关键词搜索

| Tool | Endpoint | Notes |
| --- | --- | --- |
| `tikhub_twitter_search_timeline` | `GET /api/v1/twitter/web/fetch_search_timeline` | Search by `keyword`. `search_type` defaults to `Top` and supports `Top`, `Latest`, `Media`, `People`, `Lists`. Use `Latest` for real-time monitoring. |

## 内容详情

| Tool | Endpoint | Notes |
| --- | --- | --- |
| `tikhub_twitter_tweet_detail` | `GET /api/v1/twitter/web/fetch_tweet_detail` | Fetch one tweet by `tweet_id`. Tweet IDs are passed as strings to avoid precision loss. |

## 评论

| Tool | Endpoint | Notes |
| --- | --- | --- |
| `tikhub_twitter_post_comments` | `GET /api/v1/twitter/web/fetch_post_comments` | Fetch comments under a tweet in TikHub's default order. |
| `tikhub_twitter_latest_comments` | `GET /api/v1/twitter/web/fetch_latest_post_comments` | Fetch latest comments under a tweet for new-comment monitoring. |

Both comment tools accept optional `cursor`. Leave it empty for the first page
and pass the cursor from the previous TikHub response unchanged for the next
page.

## 作者画像

| Tool | Endpoint | Notes |
| --- | --- | --- |
| `tikhub_twitter_user_profile` | `GET /api/v1/twitter/web/fetch_user_profile` | Fetch profile by `screen_name` or `rest_id`. At least one must be supplied; when both are supplied, TikHub prioritizes `rest_id`. |
| `tikhub_twitter_user_posts` | `GET /api/v1/twitter/web/fetch_user_post_tweet` | Fetch a user's historical tweets by `screen_name` or `rest_id`, with optional `cursor`. |
| `tikhub_twitter_user_replies` | `GET /api/v1/twitter/web/fetch_user_tweet_replies` | Fetch replies authored by a user. This is not a second-level comment reply API. |
| `tikhub_twitter_user_media` | `GET /api/v1/twitter/web/fetch_user_media` | Fetch media posts by `screen_name` or `rest_id`, with optional `cursor`. Live OpenAPI marks `screen_name` required, while the endpoint description documents `rest_id` as the preferred identifier when present; this tool accepts either and records `rest_id` priority in hints. |

`rest_id` is modeled as a string even though the upstream schema says integer,
because Twitter/X IDs can exceed JavaScript's safe integer range.

## 传播分析

| Tool | Endpoint | Notes |
| --- | --- | --- |
| `tikhub_twitter_trending` | `GET /api/v1/twitter/web/fetch_trending` | Fetch trending topics by `country`. The default is `UnitedStates`. |
| `tikhub_twitter_retweet_users` | `GET /api/v1/twitter/web/fetch_retweet_user_list` | Fetch users who retweeted a tweet, with optional `cursor`. |

## 用户网络

| Tool | Endpoint | Notes |
| --- | --- | --- |
| `tikhub_twitter_user_followers` | `GET /api/v1/twitter/web/fetch_user_followers` | Fetch followers by `screen_name`, with optional `cursor`. |
| `tikhub_twitter_user_followings` | `GET /api/v1/twitter/web/fetch_user_followings` | Fetch accounts followed by `screen_name`, with optional `cursor`. |

## 排除项

`GET /api/v1/twitter/web/fetch_user_highlights_tweets` is intentionally not
implemented. The local V5.3.2 OpenAPI marks it deprecated, and the live
OpenAPI downloaded during development no longer exposes this path.
