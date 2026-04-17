# Get login info (`wechat-work-get-login-info`)

Calls `GET /cgi-bin/user/getlogininfo` to get the user login information.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **auth_code** (required): Auth code from login flow.

## Output

Returns the user login info including userid, name, avatar, etc.