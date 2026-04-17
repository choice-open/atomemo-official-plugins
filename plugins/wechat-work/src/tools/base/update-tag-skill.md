# 更新标签名字 (`wechat-work-update-tag`)

调用 `POST /cgi-bin/tag/update` 更新标签名字。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **tagid**（必填）：标签ID。
- **tagname**（必填）：标签名称，长度限制为32个字（汉字或英文字母），标签不可与其他标签重名。

## 请求示例

```json
{
  "tagid": 12,
  "tagname": "UI design"
}
```

## 输出

返回 `{ errcode: number, errmsg: string }`。
