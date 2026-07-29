# TikHub YouTube Analysis Tools

This release adds YouTube social media analysis tools for keyword discovery, video metadata, captions, comments, channel research, and regional trends.

It implements 8 endpoints from `YouTube-Web-V2-API` and 2 supplemental endpoints from `YouTube-Web-API`.

## Keyword Search

### YouTube-Web-V2-API

- `tikhub_youtube_general_search_v2` -> `GET /api/v1/youtube/web_v2/get_general_search_v2`
  - Searches general YouTube content by keyword.
  - Supports `continuation_token` pagination.
  - Keeps OpenAPI filters: `upload_date`, `type`, `duration`, `features`, and `sort_by`.
- `tikhub_youtube_shorts_search_v2` -> `GET /api/v1/youtube/web_v2/get_shorts_search_v2`
  - Searches YouTube Shorts by keyword.
  - Supports `upload_date`, `sort_by`, and `continuation_token`.

For first-page searches, provide `keyword`. For pagination, pass the returned `continuation_token` unchanged; `keyword` does not need to be repeated.

## Video Understanding

### YouTube-Web-V2-API

- `tikhub_youtube_video_info_v2` -> `GET /api/v1/youtube/web_v2/get_video_info_v2`
  - Gets video metadata such as title, description, author, publish time, and engagement metrics.
  - Accepts `video_id` or `video_url`; when both are provided, `video_id` takes priority.
  - Defaults `need_format` to `true`.
- `tikhub_youtube_video_captions_v2` -> `GET /api/v1/youtube/web_v2/get_video_captions_v2`
  - Gets available captions or caption content.
  - Accepts `video_id` or `video_url`; when both are provided, `video_id` takes priority.
  - `format` is a select with `srt`, `xml`, `json3`, and `txt`; default is `srt`.

Caption flow:

1. Call the captions tool without `language_code` to discover available caption languages.
2. Pass one returned `language_code` unchanged to get caption content in the selected `format`.

## Comment Monitoring

### YouTube-Web-V2-API

- `tikhub_youtube_video_comments` -> `GET /api/v1/youtube/web_v2/get_video_comments`
  - Gets first-level comments for a video.
  - Supports `sort_by` values `top` and `newest`; default is `top`.
  - Supports `continuation_token` pagination.
  - Returns reply tokens such as `reply_continuation_token` for comment replies.
- `tikhub_youtube_comment_replies` -> `GET /api/v1/youtube/web_v2/get_video_comment_replies`
  - Gets second-level comment replies.
  - Requires the opaque `continuation_token` from a first-level comment's reply token.

Continuation token differences:

- Search continuation: comes from search result pages and fetches more search results.
- Comment continuation: comes from the first-level comments list and fetches more first-level comments.
- Reply continuation: comes from a first-level comment's reply token and fetches replies for that comment.

All continuation values are opaque TikHub strings and must be passed through exactly as returned.

## Channel Research

### YouTube-Web-V2-API

- `tikhub_youtube_search_channels` -> `GET /api/v1/youtube/web_v2/search_channels`
  - Searches YouTube channels by keyword.
  - Supports `continuation_token` pagination.
  - Defaults `need_format` to `true`.
- `tikhub_youtube_channel_videos` -> `GET /api/v1/youtube/web_v2/get_channel_videos`
  - Gets historical video metadata for a channel.
  - Supports `language_code`, `country_code`, `continuation_token`, and `need_format`.

### YouTube-Web-API

- `tikhub_youtube_channel_info` -> `GET /api/v1/youtube/web/get_channel_info`
  - Gets full channel profile data.
  - Included because V2 does not provide an equivalent full channel profile endpoint.

## Regional Trends

### YouTube-Web-API

- `tikhub_youtube_trending_videos` -> `GET /api/v1/youtube/web/get_trending_videos`
  - Gets trending videos by `language_code`, `country_code`, and `section`.
  - Defaults: `language_code=en`, `country_code=us`, `section=Now`.
  - `section` select values: `Now`, `Music`, `Gaming`, `Movies`.

## Explicit Exclusions

This release does not add any tool for video files, playback URLs, media output, or file references.

Excluded endpoints include:

- `/api/v1/youtube/web_v2/get_signed_stream_url`
- `/api/v1/youtube/web_v2/get_video_streams`
- `/api/v1/youtube/web_v2/get_video_streams_v2`

Also excluded from this release:

- V2 raw or duplicate endpoints replaced by the selected V2 endpoints
- Search suggestions
- Related videos
- Channel ID or URL conversion
- Channel descriptions
- Channel Shorts lists
- Channel community posts, post details, post comments, and post replies
- V1 endpoints that already have selected V2 replacements
- Deprecated endpoints

## OpenAPI Note

The live OpenAPI spec downloaded for this implementation did not list `/api/v1/youtube/web_v2/get_video_captions_v2`; the repository OpenAPI snapshot and product scope both include it. The tool keeps the snapshot parameters for that endpoint: `video_id`, `video_url`, `language_code`, and `format`.
