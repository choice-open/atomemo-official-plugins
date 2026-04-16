# DingTalk Atomemo Plugin

[DingTalk (钉钉)](https://www.dingtalk.com/) is Alibaba Group's enterprise communication and collaboration platform, widely used across organizations for messaging, approvals, and business process management.

This plugin connects Atomemo to the [DingTalk Open Platform](https://open.dingtalk.com/) using a single enterprise internal app credential. Once configured, you can automate user lookups, drive approval workflows, and push robot notifications — all from within Atomemo.

## Tools

### Authentication

| Tool                     | Description                                                                                                                                   | API Reference                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Get App Access Token** | Fetch the current DingTalk app access token for the configured credential. Useful for debugging or for passing the token to downstream tools. | [Obtain App Access Token](https://open.dingtalk.com/document/orgapp/obtain-orgapp-token) |

### Users

| Tool                   | Description                                                                                             | API Reference                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Get User**           | Retrieve a user's full profile (name, avatar, department list, roles, etc.) by `userId`.                | [Query User Details](https://open.dingtalk.com/document/development/query-user-details)                  |
| **Get User By Mobile** | Look up a user's `userId` by mobile phone number. Useful when you only have a phone number.             | [Query User by Phone Number](https://open.dingtalk.com/document/development/query-users-by-phone-number) |
| **Search Users**       | Search organization members by name, pinyin, or English name; supports pagination and exact-match mode. | [Address Book Search](https://open.dingtalk.com/document/development/address-book-search-user-id)        |

### Approval / Workflow

| Tool                            | Description                                                                                                                                         | API Reference                                                                                                                            |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Get Process Instance**        | Retrieve full details for an approval instance — form field values, operation history, and current task nodes.                                      | [Get Approval Instance Details](https://open.dingtalk.com/document/orgapp/obtains-approval-instance-details)                             |
| **Add Process Comment**         | Attach a text or image comment to a running approval instance. Commenter defaults to the credential's `user_union_id`.                              | [Add Process Instance Comment](https://open.dingtalk.com/document/orgapp/add-process-instance-comment)                                   |
| **Execute Process Task**        | Approve (`agree`) or reject (`refuse`) an approval task node. DingTalk requires tasks to be executed in approval-node order.                        | [Execute Process Task](https://open.dingtalk.com/document/orgapp/execute-process-task)                                                   |
| **Download Process Attachment** | Get a time-limited download URL for a form attachment or comment attachment from an approval instance.                                              | [Download Approval Attachments](https://open.dingtalk.com/document/orgapp/download-approval-attachments)                                 |
| **List Process Instance IDs**   | List approval instance IDs for a given process code, filterable by time range, initiating users, and status (`RUNNING`, `TERMINATED`, `COMPLETED`). | [Obtain Approval Instance IDs](https://open.dingtalk.com/document/development/obtain-an-approval-list-of-instance-ids)                   |
| **Get Process Space Info**      | Get the DingDrive space ID used for storing approval attachments (OA Premium feature). Required before uploading attachments to an approval form.   | [Get Approval Space Info](https://open.dingtalk.com/document/development/api-premiumgetattachmentspace)                                  |
| **List Visible Templates**      | List all approval form templates visible to a given user, with pagination. Returns process codes and template metadata.                             | [List Visible Approval Forms](https://open.dingtalk.com/document/orgapp/obtain-the-list-of-approval-forms-visible-to-the-specified-user) |

### Robot

| Tool                         | Description                                                                                                                                                              | API Reference                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Batch Send Robot Message** | Send one-to-one robot messages to up to 20 users per call. Supports text, link, Markdown, action card (single/vertical/horizontal buttons), and feed card message types. | [Batch Send to User Sessions](https://open.dingtalk.com/document/orgapp/batch-send-a-message-to-a-user-session) |
| **Send Group Robot Message** | Send a robot message to a DingTalk group chat identified by `openConversationId`. Supports the same message types as Batch Send.                                         | [Robot Sends Group Message](https://open.dingtalk.com/document/orgapp/the-robot-sends-a-group-message)          |

Note: For **Send Group Robot Message**, it is recommended to use Atomemo's built-in webhook trigger node together with this tool node so you can obtain an authentic `openConversationId` from incoming DingTalk events.

## Credential

Configure one `dingtalk-app` credential with:

- `corp_id`
- `client_id`
- `client_secret`
- `agent_id` required internal app AgentId used by workflow attachment space APIs
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
- **Agent ID**: Your DingTalk internal app AgentId, available in the [DingTalk Open Platform developer console](https://open-dev.dingtalk.com/). This is required by workflow attachment space related APIs
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

For the Simplified Chinese version, see [README.zh-Hans.md](./README.zh-Hans.md).
