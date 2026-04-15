# DingTalk Atomemo Plugin

Use DingTalk from Atomemo with a single enterprise-app credential.

## Included

- Auth: get app access token
- User: get user, get user by mobile, search users
- Workflow: get instance, add comment, get attachment download info, list instance IDs, get process space info, update instance, list visible templates
- Robot: batch send one-to-one messages, send DING, recall DING, download robot message files


## Credential

Configure one `dingtalk-app` credential with:

- `corp_id`
- `client_id`
- `client_secret`
- `user_union_id` optional default operator unionId for workflow-related operations

## Authentication Setup

This plugin uses DingTalk Open Platform enterprise internal app authentication. You will need the following information:

### 1. Create a DingTalk Enterprise Internal App

1. Sign in to the [DingTalk Open Platform developer console](https://open-dev.dingtalk.com/)
2. Create an enterprise internal app
3. In `Basic Information -> Credentials and Basic Information -> App Credentials`, get the app's `Client ID` and `Client Secret`

### 2. Configure the Atomemo Credential

Create a `dingtalk-app` credential in Atomemo:

- **Corp ID**: The organization ID where your DingTalk app runs, available from the [DingTalk Open Platform developer console](https://open-dev.dingtalk.com/)
- **Client ID**: Your DingTalk app Client ID
- **Client Secret**: Your DingTalk app Client Secret
- **Operator unionId (optional)**: If you already know a commonly used operator's unionId, you can fill it in here and tools will reuse it by default. You can also leave it empty and override it later in individual tool parameters when needed

### 3. Configure Permissions

Make sure your DingTalk app has the required permissions in `App Details -> Development Configuration -> Permission Management`.
For the exact permission set, refer to the relevant official API documentation or the runtime error messages returned by DingTalk.

For the full authentication flow, see the official docs: [DingTalk API Calling Guide](https://open.dingtalk.com/document/development/how-to-call-apis) and [Get Access Token](https://open.dingtalk.com/document/development/api-gettoken).

## Development

```bash
bun install
bun run typecheck
bun run test
bun run build
```
