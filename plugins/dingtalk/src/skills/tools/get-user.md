# dingtalk / get-user

Get user details by DingTalk userId.

## Input Parameters

| Field           | Type            | Required | Default | Description                         |
| --------------- | --------------- | -------- | ------- | ----------------------------------- |
| `credential_id` | `credential_id` | yes      | —       | Links to credential `dingtalk-app`. |
| `user_id`       | `string`        | yes      | —       | DingTalk user ID to retrieve.       |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "user_id": "user123"
}
```

## Credential

- Credential name: `dingtalk-app`

## Success Output

```json
{
    "errcode": 0,
    "errmsg": "ok",
    "request_id": "16mn0sl6oplfp",
    "result": {
      "active": true,
      "admin": true,
      "avatar": "",
      "boss": true,
      "create_time": "2025-05-28T06:39:19.000Z",
      "dept_id_list": [
        1
      ],
      "dept_order_list": [
        {
          "dept_id": 1,
          "order": 176169207419780500
        }
      ],
      "exclusive_account": false,
      "hide_mobile": false,
      "leader_in_dept": [
        {
          "dept_id": 1,
          "leader": false
        }
      ],
      "name": "John",
      "real_authed": true,
      "role_list": [
        {
          "group_name": "默认",
          "id": 4956354843,
          "name": "主管理员"
        },
        {
          "group_name": "默认",
          "id": 4956354845,
          "name": "负责人"
        }
      ],
      "senior": false,
      "unionid": "7NBLG0T38Zn6VzCG7KCJmAiEiE",
      "userid": "093204182627445986"
    }
  }
```

