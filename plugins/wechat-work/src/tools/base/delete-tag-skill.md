# 删除标签 (`wechat-work-delete-tag`)

调用 `GET /cgi-bin/tag/delete` 删除标签。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **tagid**（必填）：标签ID。

## 输出

返回 `{ errcode: number, errmsg: string }`。
