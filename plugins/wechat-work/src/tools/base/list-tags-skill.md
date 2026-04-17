# 获取标签列表 (`wechat-work-list-tags`)

调用 `GET /cgi-bin/tag/list` 获取标签列表。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。

## 输出

返回 `{ errcode: number, errmsg: string, taglist: Array<{ tagid: number, tagname: string }> }`。
