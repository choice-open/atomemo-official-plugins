# Add KF robot (`wechat-work-add-kf-robot`)

Calls `POST /cgi-bin/kf/robot/add` to add a customer service robot.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **name** (required): Robot name (max 20 chars).
- **avatar_media_id** (optional): Avatar media ID.

## Output

Returns the robot ID.