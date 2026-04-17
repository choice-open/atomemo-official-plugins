# Resident report (`wechat-work-resident-report`)

Calls `POST /report/resident/add` to submit a resident report.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **grid_id** (required): Grid ID to report to
- **category_id** (required): Event category ID
- **desc** (required): Event description (max 500 characters)
- **urge_type** (optional): Urgency level (1-Normal, 2-Important, 3-Urgent)
- **reporter_name** (optional): Name of the reporter
- **reporter_mobile** (optional): Reporter mobile number
- **address** (optional): Location address
- **latitude** (optional): Latitude (-90 to 90)
- **longitude** (optional): Longitude (-180 to 180)
- **image_urls** (optional): Comma-separated image URLs (max 9)
- **video_media_ids** (optional): Comma-separated video media IDs (max 3)

## Output

Returns `{ order_id: string }` on success.
