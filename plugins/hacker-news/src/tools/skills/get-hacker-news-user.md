# hacker-news / get-hacker-news-user

Fetch a Hacker News user profile by username through the Algolia API.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `username` | `string` | yes | `""` | Hacker News username to fetch. |

### Example Input

```json
{
  "username": "pg"
}
```

## Credential

- No credential is required.

## Success Output

```json
{
  "user": {
    "username": "pg",
    "karma": 157316,
    "about": "Bug fixer."
  }
}
```

### Output Notes

- `user.username` is the normalized Hacker News username.
- `karma` and `about` may be `null` when the upstream API omits them.
