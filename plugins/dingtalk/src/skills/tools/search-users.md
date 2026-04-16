# dingtalk / search-users

Search DingTalk users by name, pinyin, or English name.

## Input Parameters

| Field              | Type            | Required | Default | Description                                            |
| ------------------ | --------------- | -------- | ------- | ------------------------------------------------------ |
| `credential_id`    | `credential_id` | yes      | —       | Links to credential `dingtalk-app`.                    |
| `query_word`       | `string`        | yes      | —       | Keyword to search by name, pinyin, or English name.    |
| `offset`           | `integer`       | no       | `0`     | Pagination offset starting from 0.                     |
| `size`             | `integer`       | no       | `10`    | Number of users to return (1–100).                     |
| `full_match_field` | `boolean`       | no       | `false` | Whether to require an exact match on supported fields. |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "query_word": "Zhang San",
  "offset": 0,
  "size": 10,
  "full_match_field": false
}
```

## Credential

- Credential name: `dingtalk-app`

## Success Output

```json
{
  "hasMore": false,
  "totalCount": 1,
  "list": ["user123"]
}
```

