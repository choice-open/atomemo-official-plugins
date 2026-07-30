# TikHub Weibo Analysis Tools

This release adds Weibo data retrieval tools for keyword monitoring, hot search discovery, post text, comments, user research, historical posts, and repost propagation.

It implements 9 endpoints from `Weibo-Web-V2-API` and 1 supplemental endpoint from `Weibo-App-API`. `Weibo-Web-API` is not used.

## Search And Hot Search

### Weibo-Web-V2-API

- `tikhub_weibo_advanced_search` -> `GET /api/v1/weibo/web_v2/fetch_advanced_search`
  - Searches Weibo by required keyword `q`.
  - Supports `search_type`, `include_type`, `timescope`, and `page`.
  - Select values: `search_type=all|hot|original|verified|media|viewpoint`; `include_type=all|pic|video|music|link`.
  - `timescope` stays an upstream string, for example `custom:开始日期小时:结束日期小时`.
- `tikhub_weibo_realtime_search` -> `GET /api/v1/weibo/web_v2/fetch_realtime_search`
  - Fetches latest Weibo posts by required `query`, sorted by time.
  - Uses `page` pagination, default `1`.
- `tikhub_weibo_hot_search_summary` -> `GET /api/v1/weibo/web_v2/fetch_hot_search_summary`
  - Fetches the complete Weibo hot search ranking, currently about 50 items.
  - Has no business parameters.

## Post Text

### Weibo-Web-V2-API

- `tikhub_weibo_post_detail` -> `GET /api/v1/weibo/web_v2/fetch_post_detail`
  - Gets complete post content, author data, and engagement metrics by Weibo post `id`.
  - `is_get_long_text` is a string select with `true` and `false`; default is `true`.

## Comment Monitoring

### Weibo-Web-V2-API

- `tikhub_weibo_post_comments` -> `GET /api/v1/weibo/web_v2/fetch_post_comments`
  - Gets first-level comments by Weibo post `id`.
  - `count` defaults to `10`; `max_id` defaults to an empty string for the first request.
- `tikhub_weibo_post_sub_comments` -> `GET /api/v1/weibo/web_v2/fetch_post_sub_comments`
  - Gets replies under a first-level comment.
  - The `id` parameter is the main comment ID, not the Weibo post ID.
  - `count` defaults to `10`; `max_id` defaults to an empty string for the first request.

## User And Competitor Research

### Weibo-Web-V2-API

- `tikhub_weibo_user_search` -> `GET /api/v1/weibo/web_v2/fetch_user_search`
  - Searches Weibo users by `query` and optional filters.
  - Supports `page`, `region`, `auth`, `gender`, `age`, `nickname`, `tag`, `school`, and `work`.
  - Select values: `auth=org_vip|per_vip|ord`; `gender=man|women`; `age=18y|22y|29y|39y|40y`.
  - `region` is a Weibo region code string; this release does not add `/fetch_city_list`.
- `tikhub_weibo_user_info` -> `GET /api/v1/weibo/web_v2/fetch_user_info`
  - Gets detailed user profile information by `uid` or `custom`.
  - At least one of `uid` or `custom` is required at runtime. When both are supplied, `uid` takes priority.
- `tikhub_weibo_user_posts` -> `GET /api/v1/weibo/web_v2/fetch_user_posts`
  - Gets historical Weibo posts by `uid`.
  - Supports `page`, `feature`, and `since_id`.
  - `feature` defaults to `0`: `0` = 10 basic posts, `1` = 20 extended posts, `2` = 20 image-related posts, `3` = 20 video-related posts.

## Repost Propagation

### Weibo-App-API

- `tikhub_weibo_post_reposts` -> `GET /api/v1/weibo/app/fetch_status_reposts`
  - Gets repost users by `status_id`.
  - `max_id` is omitted for the first request and passed unchanged for pagination.
  - Included because Web V2 does not provide the needed repost-user list endpoint.

## Pagination

- `page` is a numeric page number and defaults to `1` where present.
- `max_id` is an opaque pagination value for comments, sub-comments, and reposts. Pass it exactly as returned by TikHub.
- `since_id` is an opaque pagination value for user posts. Pass it exactly as returned by TikHub.

## ID Handling

Weibo post IDs, comment IDs, `uid`, `status_id`, `max_id`, and `since_id` must be treated as strings. Do not convert them to numbers, because social platform IDs may exceed JavaScript's safe integer range.

## Explicit Exclusions

This release does not implement:

- All 11 legacy `Weibo-Web-API` endpoints.
- V2 AI search and AI related search.
- Similar search, picture search, video search, and topic search.
- Category rankings, entertainment rankings, life rankings, social rankings, and hot ranking timelines.
- User fans, followings, recommended timelines, and groups.
- User video list and video collection endpoints.
- App video detail, video feeds, albums, audio, and article endpoints.
- Repost likes, status likes, home recommend feed, App hot search, and App AI smart search.
- Duplicate endpoints outside the selected V2/App pair.
- Deprecated endpoints.

This release does not add video playback URL extraction, video downloads, Referer handling, or `file_ref` output. Video metadata present in search results is returned unchanged as part of TikHub's response.
