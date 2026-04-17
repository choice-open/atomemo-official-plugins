# 上传图片 (`wechat-work-upload-image`)

调用 `POST /cgi-bin/media/uploadimg` 上传图片得到图片URL，该URL永久有效。返回的图片URL，仅能用于图文消息正文中的图片展示，或者给客户发送欢迎语等；若用于非企业微信环境下的页面，图片将被屏蔽。每个企业每月最多可上传3000张图片，每天最多可上传1000张图片。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **media**（必填）：`file_ref`，要上传的图片文件（5B ~ 2MB）。

## 输出

| 参数 | 说明 |
| --- | --- |
| url | 上传后得到的图片URL。永久有效 |
