# Get user info (`wechat-work-get-user-info`)

Calls `GET /cgi-bin/user/getuserinfo` to get the user identity via OAuth2.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **code** (required): OAuth2 authorization code.

## Output

Returns the user info including UserId and DeviceId.