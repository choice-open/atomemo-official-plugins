# 发送新客户欢迎语 (`wechat-work-send-welcome-message`)

调用 `POST /cgi-bin/externalcontact/send_welcome_msg` 通过成员向新添加的客户发送个性化的欢迎语。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| welcome_code | 是 | string | 通过添加外部联系人事件推送给企业的发送欢迎语的凭证，有效期为20秒 |
| text.content | 否 | string | 消息文本内容，最长为4000字节 |
| attachments | 否 | obj[] | 附件，最多可添加9个附件 |
| attachments[].msgtype | 是 | string | 附件类型，可选image、link、miniprogram、video或file |

注意：企业仅可在收到相关事件后20秒内调用，且只可调用一次。text和attachments不能同时为空。

## 请求示例

```json
{
  "welcome_code": "CALLBACK_CODE",
  "text": { "content": "文本消息内容" },
  "attachments": [
    { "msgtype": "image", "image": { "media_id": "MEDIA_ID" } }
  ]
}
```

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
