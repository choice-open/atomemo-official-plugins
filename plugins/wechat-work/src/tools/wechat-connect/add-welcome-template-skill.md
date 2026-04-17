# 添加入群欢迎语素材 (`wechat-work-add-welcome-template`)

调用 `POST /cgi-bin/externalcontact/group_welcome_template/add` 向企业的入群欢迎语素材库中添加素材。每个企业的入群欢迎语素材库中，最多容纳100个素材。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| text.content | 否 | string | 消息文本内容，最长为3000字节，支持%NICKNAME%占位符 |
| image.media_id | 否 | string | 图片的media_id，可以通过素材管理接口获得 |
| image.pic_url | 否 | string | 图片的链接，仅可使用上传图片接口得到的链接 |
| link.title | 是 | string | 图文消息标题，最长为128字节 |
| link.picurl | 否 | string | 图文消息封面的url |
| link.desc | 否 | string | 图文消息的描述，最长为512字节 |
| link.url | 是 | string | 图文消息的链接 |
| miniprogram.title | 是 | string | 小程序消息标题，最长为64字节 |
| miniprogram.pic_media_id | 是 | string | 小程序消息封面的mediaid，封面图建议尺寸为520*416 |
| miniprogram.appid | 是 | string | 小程序appid，必须是关联到企业的小程序应用 |
| miniprogram.page | 是 | string | 小程序page路径 |
| file.media_id | 是 | string | 文件id，可以通过素材管理、异步上传临时素材接口获得 |
| video.media_id | 是 | string | 视频媒体文件id，可以通过素材管理、异步上传临时素材接口获得 |
| agentid | 否 | int | 授权方安装的应用agentid。仅旧的第三方多应用套件需要填此参数 |
| notify | 否 | int | 是否通知成员将这条入群欢迎语应用到客户群中，0-不通知，1-通知，不填则通知 |

注意：text以外的消息类型只能有一个，按image、link、miniprogram、file、video优先顺序取参。

## 请求示例

```json
{
  "text": { "content": "亲爱的%NICKNAME%用户，你好" },
  "image": { "media_id": "MEDIA_ID" },
  "notify": 1
}
```

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| template_id | 欢迎语素材id |
