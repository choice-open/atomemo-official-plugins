# Get login code (`wechat-work-get-login-code`)

Calls `GET /login/authcode/get` to get the login authcode for Web login.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **web_login_link** (optional): URL to redirect after login.

## Output

Returns the auth code.