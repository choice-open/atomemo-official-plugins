# 删除日历 (`wechat-work-delete-calendar`)

调用 `POST /cgi-bin/oa/calendar/del` 删除指定日历。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **cal_id**（必填）：日历ID。

## 请求示例

```json
{
    "cal_id": "wcjgewCwAAqeJcPI1d8Pwbjt7nttzAAA"
}
```

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 错误码 |
| errmsg | 错误码说明 |
