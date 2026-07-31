# Instagram V1 Analysis Tools

TikHub Instagram V1 analysis tools cover a compact data acquisition workflow for
social listening, hashtag and topic discovery, potential customer discovery, and
competitor account analysis.

This release includes 10 GET tools from the `Instagram-V1-API` group. All tools
use the shared `tikhub-api-key` credential and send business parameters as query
parameters. The tools return TikHub responses as-is and do not summarize, score
leads, run sentiment analysis, persist results, or download media files.

Endpoints whose path is `/api/v1/instagram/v1/...` and whose tag is
`Instagram-V1-API` are treated as V1 group endpoints even when the endpoint name
contains `_v2` or `_v3`. This release does not include `Instagram-V2-API` or
`Instagram-V3-API` group endpoints.

## Search And Topic Discovery

- `tikhub_instagram_search`
  - GET `/api/v1/instagram/v1/fetch_search`
  - Searches users, hashtags, and places by `query`.
  - `select` may be `users`, `hashtags`, or `places`; omit it to return all
    result types.

- `tikhub_instagram_hashtag_posts`
  - GET `/api/v1/instagram/v1/fetch_hashtag_posts`
  - Fetches posts under a hashtag.
  - `hashtag` is required and must not include the `#` prefix.
  - Pagination uses `end_cursor`; pass returned cursors unchanged.

Keyword chain:

1. Call `tikhub_instagram_search`.
2. Read hashtag candidates from the search results.
3. Call `tikhub_instagram_hashtag_posts`.
4. Fetch individual posts and comments for deeper analysis.

## Post And Comment Thread

- `tikhub_instagram_post_by_url`
  - GET `/api/v1/instagram/v1/fetch_post_by_url`
  - Fetches full post details by `post_url`.
  - This tool intentionally uses the base V1 endpoint instead of
    `fetch_post_by_url_v2` because the selected endpoint returns fuller data for
    this workflow.

- `tikhub_instagram_post_by_id`
  - GET `/api/v1/instagram/v1/fetch_post_by_id`
  - Fetches post details by `post_id`.
  - `post_id` is treated as a string and is never converted to a number.

- `tikhub_instagram_post_comments`
  - GET `/api/v1/instagram/v1/fetch_post_comments_v2`
  - Fetches comments by `media_id`.
  - `sort_order` defaults to `recent` and supports `popular` or `recent`.
  - Pagination uses `min_id` from `next_min_id`; pass it unchanged.

- `tikhub_instagram_comment_replies`
  - GET `/api/v1/instagram/v1/fetch_comment_replies`
  - Fetches replies for `comment_id` under a `media_id`.
  - Pagination uses `min_id` from `next_min_id`; pass it unchanged.

Post chain:

1. Start with `tikhub_instagram_post_by_url` for a known link, or
   `tikhub_instagram_post_by_id` for a known post ID.
2. Call `tikhub_instagram_post_comments` with the returned media ID.
3. Call `tikhub_instagram_comment_replies` with `media_id` and a parent
   `comment_id`.

## Account And Competitor Analysis

- `tikhub_instagram_user_profile`
  - GET `/api/v1/instagram/v1/fetch_user_info_by_username_v3`
  - Fetches detailed profile data by `username`.
  - The endpoint name contains `v3`, but the OpenAPI tag and path place it in
    the `Instagram-V1-API` group.

- `tikhub_instagram_user_posts`
  - GET `/api/v1/instagram/v1/fetch_user_posts`
  - Fetches historical posts by `user_id`.
  - `count` defaults to 12 and must be between 1 and 50.
  - Pagination uses `max_id`; pass it unchanged.

- `tikhub_instagram_user_reels`
  - GET `/api/v1/instagram/v1/fetch_user_reels`
  - Fetches Reels by `user_id`.
  - `count` defaults to 12 and must be between 1 and 50.
  - Pagination uses `max_id`; pass it unchanged.

- `tikhub_instagram_user_tagged_posts`
  - GET `/api/v1/instagram/v1/fetch_user_tagged_posts`
  - Fetches posts where the user is tagged.
  - `count` defaults to 12 and must be between 1 and 50.
  - Pagination uses `end_cursor`; pass it unchanged.

Account chain:

1. Call `tikhub_instagram_search` with `select=users`, or use a known username.
2. Call `tikhub_instagram_user_profile` to obtain profile metadata and user ID.
3. Call `tikhub_instagram_user_posts`, `tikhub_instagram_user_reels`, and
   `tikhub_instagram_user_tagged_posts` for competitor or lead context.

## ID And Cursor Handling

All IDs and cursors are passed as strings. The plugin does not parse, decode,
rewrite, or convert `post_id`, `media_id`, `comment_id`, `user_id`,
`end_cursor`, `min_id`, or `max_id`.

## Not Included

This release intentionally does not implement the remaining Instagram V1
endpoints, the `Instagram-V2-API` or `Instagram-V3-API` groups, media download,
locations content, music content, Explore, city/location directories, repost
lists, similar account recommendations, ID/shortcode conversion, summaries,
sentiment analysis, lead scoring, competitor scoring, or persistence.
