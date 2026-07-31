# Toutiao App Analysis Tools

TikHub Toutiao App analysis tools cover known article, video, comment, and user
profile lookup workflows. This release implements all 5 GET endpoints in the
`Toutiao-App-API` group and intentionally does not implement the duplicate
`Toutiao-Web-API` detail endpoints.

All tools use the shared `tikhub-api-key` credential and send business
parameters as query parameters. The tools return TikHub responses as-is and do
not download article images, videos, or other media files. They also do not
summarize, run sentiment analysis, score leads, score competitors, persist
results, or schedule monitoring.

## Article Workflow

- `tikhub_toutiao_article_info`
  - GET `/api/v1/toutiao/app/get_article_info`
  - Fetches metadata and content fields for a known Toutiao article.
  - `group_id` is required and must be passed as a string. For example,
    `https://www.toutiao.com/article/7450114952884503059/` contains group ID
    `7450114952884503059`.

Article chain:

1. Extract `group_id` from a known article URL.
2. Call `tikhub_toutiao_article_info`.
3. Call `tikhub_toutiao_post_comments` for comment analysis.

## Video Workflow

- `tikhub_toutiao_video_info`
  - GET `/api/v1/toutiao/app/get_video_info`
  - Fetches metadata for a known Toutiao video post.
  - `group_id` is required and must be passed as a string. For example,
    `https://www.toutiao.com/video/7431543350882206242/` contains group ID
    `7431543350882206242`.
  - The tool does not download or play video media.

Video chain:

1. Extract `group_id` from a known video URL.
2. Call `tikhub_toutiao_video_info`.
3. Call `tikhub_toutiao_post_comments` for comment analysis.

## Comments

- `tikhub_toutiao_post_comments`
  - GET `/api/v1/toutiao/app/get_comments`
  - Fetches comments for a known Toutiao article or video post.
  - `group_id` is required and must be passed as a string.
  - `offset` is required and OpenAPI declares it as a string. Use `"0"` for the
    first request, then increase by 20 for subsequent pages while keeping the
    value as a string.

## Account Workflow

- `tikhub_toutiao_user_id_from_profile`
  - GET `/api/v1/toutiao/app/get_user_id`
  - Resolves a full Toutiao user profile URL to `user_id`.
  - `user_profile_url` is required. Pass the complete profile URL, not only a
    username or token fragment.

- `tikhub_toutiao_user_info`
  - GET `/api/v1/toutiao/app/get_user_info`
  - Fetches Toutiao user profile information by `user_id`.
  - `user_id` is required and must be passed as a string.

Account chain:

1. Call `tikhub_toutiao_user_id_from_profile` with a full user profile URL.
2. Call `tikhub_toutiao_user_info` with the returned `user_id`.

## ID And Pagination Handling

All `group_id`, `user_id`, and `offset` values are passed as strings. The plugin
does not parse, decode, rewrite, or convert long numeric IDs to JavaScript
numbers, avoiding precision loss.

## Not Included

This release does not implement `Toutiao-Web-API` because its article and video
detail endpoints duplicate the App group detail workflow without adding comment
or user profile capabilities. TikHub's current Toutiao OpenAPI also does not
provide keyword search, hot search, user feed or post lists, comment replies,
complete comment trees, video captions, or speech transcripts, so these
capabilities are outside this release.
