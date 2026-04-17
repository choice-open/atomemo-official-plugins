# 创建标签 (`wechat-work-create-tag`)

调用 `POST /cgi-bin/tag/create` 创建标签。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **tagname**（必填）：标签名称，长度限制为32个字以内（汉字或英文字母），标签名不可与其他标签重名。
- **tagid**（选填）：标签id，非负整型，指定此参数时新增的标签会生成对应的标签id，不指定时则以目前最大的id自增。

## 请求示例

```json
{
  "tagname": "UI",
  "tagid": 12
}
```

## 输出

返回 `{ errcode: number, errmsg: string, tagid: number }`。
