# Bilibili Analysis Tools

TikHub Bilibili analysis tools cover a compact workflow for keyword discovery,
video understanding, interaction analysis, and UP creator/account analysis.

This release includes 11 GET endpoints from `Bilibili-Web-API`. All tools use the shared `tikhub-api-key`
credential and send business parameters as query parameters. The tools return
TikHub responses as-is and do not summarize, score leads, score competitors,
persist results, schedule monitoring, fetch video stream URLs, play media, or
download media files.

## Keyword Discovery

- `tikhub_bilibili_general_search`
  - GET `/api/v1/bilibili/web/fetch_general_search`
  - Searches Bilibili Web video results by `keyword`.
  - `order` is required and supports `totalrank`, `click`, `pubdate`, `dm`,
    and `stow`.
  - `page` and `page_size` are required. Use `page=1` for the first request.
  - `duration` defaults to `0`: `0` all, `1` under 10 minutes, `2` 10-30
    minutes, `3` 30-60 minutes, and `4` over 60 minutes.
  - `pubtime_begin_s` and `pubtime_end_s` default to `0` and use 10-digit Unix
    timestamps when filtering by publish time.
  - This Web search replaces the App typed search for video discovery because
    App search returns AV-style numeric IDs and does not expose BV IDs needed by
    the downstream Web video detail/comment tools.

Keyword chain:

1. Call `tikhub_bilibili_general_search`.
2. Read `bvid`/`bv_id` from video search results when present.
3. Use BV IDs with `tikhub_bilibili_video_details`.

## Video Understanding And Interaction

- `tikhub_bilibili_video_details`
  - GET `/api/v1/bilibili/web/fetch_one_video`
  - Fetches video details by `bv_id`, for example `BV1M1421t7hT`.
  - Use the returned video detail payload as the main upstream source for
    `aid`/`cid` values when available.

- `tikhub_bilibili_video_subtitles`
  - GET `/api/v1/bilibili/web/fetch_video_subtitle`
  - Fetches subtitle information by `a_id` and `c_id`.
  - Both IDs are passed as strings.

- `tikhub_bilibili_video_comments`
  - GET `/api/v1/bilibili/web/fetch_video_comments`
  - Fetches first-level comments by `bv_id`.
  - `pn` defaults to 1.

- `tikhub_bilibili_comment_replies`
  - GET `/api/v1/bilibili/web/fetch_comment_reply`
  - Fetches replies below a specific comment by `bv_id` and `rpid`.
  - `pn` defaults to 1.

- `tikhub_bilibili_video_danmaku`
  - GET `/api/v1/bilibili/web/fetch_video_danmaku`
  - Fetches real-time danmaku by `cid`.
  - `cid` is passed as a string.

Known video chain:

1. Extract `bv_id` from a known Bilibili video URL.
2. Call `tikhub_bilibili_video_details`.
3. Read `aid`/`cid` fields from the returned detail payload when present.
4. Call `tikhub_bilibili_video_subtitles` with `a_id` and `c_id`.
5. Call `tikhub_bilibili_video_comments` with `bv_id`.
6. Call `tikhub_bilibili_comment_replies` for selected parent comments, and
   call `tikhub_bilibili_video_danmaku` in parallel when a `cid` is available.

## Account And Competitor Analysis

- `tikhub_bilibili_user_profile`
  - GET `/api/v1/bilibili/web/fetch_user_profile`
  - Fetches user profile information by `uid`.

- `tikhub_bilibili_user_videos`
  - GET `/api/v1/bilibili/web/fetch_user_post_videos`
  - Fetches posted videos by `uid`.
  - `pn` defaults to 1.
  - `order` defaults to `pubdate` and supports `pubdate`, `click`, and `stow`.

- `tikhub_bilibili_user_dynamics`
  - GET `/api/v1/bilibili/web/fetch_user_dynamic`
  - Fetches a user's dynamic feed by `uid`.
  - Pagination uses opaque `offset`; leave it empty for the first request and
    pass returned offsets unchanged.

- `tikhub_bilibili_user_up_stats`
  - GET `/api/v1/bilibili/web/fetch_user_up_stat`
  - Fetches UP creator total views and total likes by `uid`.

- `tikhub_bilibili_user_relation_stats`
  - GET `/api/v1/bilibili/web/fetch_user_relation_stat`
  - Fetches following and follower counts by `uid`.

Account chain:

1. Start from a known `uid`, or read UP creator IDs from search/detail payloads.
2. Call `tikhub_bilibili_user_profile`.
3. Call `tikhub_bilibili_user_videos`, `tikhub_bilibili_user_dynamics`,
   `tikhub_bilibili_user_up_stats`, and
   `tikhub_bilibili_user_relation_stats` for account context.

## ID And Pagination Handling

`bv_id`, `a_id`, `c_id`, `cid`, `uid`, `rpid`, and `offset` are
passed as strings. The plugin does not parse, decode, rewrite, or convert these
identifiers to JavaScript numbers.

Bilibili uses these pagination patterns in this release:

- Web general search uses `page`.
- Web user dynamics uses opaque `offset` from the previous response.
- Comment and user video lists use page number `pn`.

## Not Included

This release does not implement Bilibili App endpoints, App typed search,
recommendations, popular feeds, App duplicate video/comment/user endpoints, Web
hot search, popular videos, collections, live room details, live streams, live
areas, video stream URLs, VIP play URLs, media downloads, duplicate video detail
V2/V3 endpoints, dynamic detail V1/V2, summaries, sentiment analysis, lead
scoring, competitor scoring, persistence, or scheduled monitoring.
