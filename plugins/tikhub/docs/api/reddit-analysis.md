# Reddit Analysis Tools

TikHub Reddit analysis tools cover the selected `Reddit-APP-API` data
acquisition workflow for social listening, topic monitoring, community
research, user behavior research, competitor reputation checks, and potential
lead discovery.

This release includes 10 GET tools. All tools use the shared `tikhub-api-key`
credential and send business parameters as query parameters. The tools return
TikHub responses as-is and do not summarize, score leads, run sentiment
analysis, persist results, or download media files.

`need_format=false` is the live OpenAPI schema default for every included Reddit
tool. Set it to true only when you want TikHub to return cleaned/formatted data.

## Keyword Search

- `tikhub_reddit_dynamic_search`
  - GET `/api/v1/reddit/app/fetch_dynamic_search`
  - Searches Reddit by keyword across five search types:
    `post`, `community`, `comment`, `media`, and `people`.
  - `search_type` defaults to `post`.
  - `sort` is required, defaults to `RELEVANCE`, and supports `RELEVANCE`,
    `HOT`, `TOP`, `NEW`, and `COMMENTS`.
  - `time_range` supports `all`, `year`, `month`, `week`, `day`, and `hour`.
  - Applicability rules are enforced before the request:
    `post` and `media` may send `sort` and `time_range`; `comment` may send
    `sort` but not `time_range`; `community` and `people` send neither.
    `sort=COMMENTS` is valid only for `post`.
  - `safe_search` defaults to `unset`; `allow_nsfw` defaults to `"0"`.
  - Pagination uses `after`; pass returned cursors unchanged.

- `tikhub_reddit_trending_searches`
  - GET `/api/v1/reddit/app/fetch_trending_searches`
  - Fetches current Reddit trending searches for hotspot discovery and keyword
    expansion.

## Post Comment Tree

- `tikhub_reddit_post_details`
  - GET `/api/v1/reddit/app/fetch_post_details`
  - Fetches one post by `post_id`.
  - `post_id` is a string and must include the `t3_` prefix.
  - `include_comment_id` defaults to false. When it is true, `comment_id` is
    required and must include the `t1_` prefix.
  - Media fields are returned from TikHub but the plugin does not download media.

- `tikhub_reddit_post_comments`
  - GET `/api/v1/reddit/app/fetch_post_comments`
  - Fetches first-level comments for a post.
  - `sort_type` defaults to `CONFIDENCE` and supports `CONFIDENCE`, `NEW`,
    `TOP`, `HOT`, `CONTROVERSIAL`, `OLD`, and `RANDOM`.
  - Pagination uses `after`. For deeper replies, find a comment node with
    `childCount > 0` and a `more.cursor` value.

- `tikhub_reddit_comment_replies`
  - GET `/api/v1/reddit/app/fetch_comment_replies`
  - Fetches replies under a comment node.
  - `cursor` is required and must be passed unchanged from `more.cursor`, often
    shaped like `commenttree:ex:(...)`.
  - `sort_type` defaults to `CONFIDENCE` and uses the same values as post
    comments.

Comment chain:

1. Call `tikhub_reddit_post_comments`.
2. Find a first-level comment where `childCount > 0` and `more.cursor` exists.
3. Call `tikhub_reddit_comment_replies` with that cursor unchanged.

## Community Analysis

- `tikhub_reddit_subreddit_info`
  - GET `/api/v1/reddit/app/fetch_subreddit_info`
  - Fetches subreddit profile, description, member count, and creation metadata.
  - Live OpenAPI still marks `subreddit_name` optional with default `pics`.
  - Enter subreddit names without the `r/` prefix.

- `tikhub_reddit_subreddit_feed`
  - GET `/api/v1/reddit/app/fetch_subreddit_feed`
  - Fetches posts from a subreddit feed.
  - `subreddit_name` is required and must not include `r/`.
  - `sort` defaults to `BEST` and supports `BEST`, `HOT`, `NEW`, `TOP`,
    `CONTROVERSIAL`, and `RISING`.
  - Pagination uses `after`.
  - The live OpenAPI declares `filter_posts` as a query array with default `[]`
    but does not declare serialization. This release intentionally does not
    expose it.

Community chain:

1. Search with `search_type=community`.
2. Read the subreddit name from the result.
3. Fetch subreddit info.
4. Fetch subreddit feed.

## User Analysis

- `tikhub_reddit_user_profile`
  - GET `/api/v1/reddit/app/fetch_user_profile`
  - Fetches profile data such as account age, karma, bio, verification, and
    badges.
  - `username` is required and must not include `u/`.

- `tikhub_reddit_user_posts`
  - GET `/api/v1/reddit/app/fetch_user_posts`
  - Fetches posts submitted by a user.
  - `sort` defaults to `NEW` and supports `NEW`, `TOP`, `HOT`, and
    `CONTROVERSIAL`.
  - Pagination uses `after`.

- `tikhub_reddit_user_comments`
  - GET `/api/v1/reddit/app/fetch_user_comments`
  - Fetches comments written by a user.
  - `sort` defaults to `NEW` and supports `NEW`, `TOP`, `HOT`, and
    `CONTROVERSIAL`.
  - `page_size` defaults to 25. Live OpenAPI does not declare a numeric range,
    so this plugin does not invent one.
  - Pagination uses `after`.

User chain:

1. Search with `search_type=people`, or read authors from posts/comments.
2. Fetch user profile.
3. Fetch user posts.
4. Fetch user comments.

## Not Included

This release intentionally does not implement Home, Popular, Games, News,
Explore, Topic feeds, search typeahead, Community Highlights, Reddit Answers
generated posts/comments, batch post details, subreddit settings, style, post
channels, muted status, user active subreddits, user trophies, media download,
summarization, sentiment analysis, lead scoring, or persistence.
