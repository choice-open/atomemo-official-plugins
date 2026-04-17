# 发送消息 (`wechat-work-send-kf-message`)

调用 `POST /cgi-bin/kf/send_msg` 当微信客户处于"新接入待处理"或"由智能助手接待"状态下，可调用该接口给用户发送消息。

支持发送消息类型：文本、图片、语音、视频、文件、图文、小程序、菜单消息、地理位置、获客链接。

用户主动发送消息给客服后的48小时内，企业可发送消息给客户，最多可发送5条消息。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| touser | 是 | string | 指定接收消息的客户UserID |
| open_kfid | 是 | string | 指定发送消息的客服账号ID |
| msgid | 否 | string | 指定消息ID，不多于32字节，取值范围：[0-9a-zA-Z_-]* |
| msgtype | 是 | string | 消息类型：text/image/voice/video/file/link/miniprogram/msgmenu/location/ca_link |
| text | - | obj | 文本消息 { content: string }，最长不超过2048个字节 |
| image | - | obj | 图片消息 { media_id: string } |
| voice | - | obj | 语音消息 { media_id: string } |
| video | - | obj | 视频消息 { media_id: string } |
| file | - | obj | 文件消息 { media_id: string } |
| link | - | obj | 图文链接 { title, desc?, url, thumb_media_id } |
| miniprogram | - | obj | 小程序 { appid, title?, thumb_media_id, pagepath } |
| msgmenu | - | obj | 菜单消息 { head_content?, list?: obj[], tail_content? } |
| location | - | obj | 地理位置 { name?, address?, latitude, longitude } |
| ca_link | - | obj | 获客链接 { link_url } |

## 请求示例（文本消息）

```json
{
    "touser": "EXTERNAL_USERID",
    "open_kfid": "OPEN_KFID",
    "msgtype": "text",
    "text": {
        "content": "你好，有什么可以帮助你的？"
    }
}
```

## 输出

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errcode | int32 | 返回码 |
| errmsg | string | 错误码描述 |
| msgid | string | 消息ID。如果请求参数指定了msgid，则原样返回，否则系统自动生成并返回 |
