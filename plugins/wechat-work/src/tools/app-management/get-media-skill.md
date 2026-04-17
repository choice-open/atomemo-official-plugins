# 获取临时素材 (`wechat-work-get-media`)

调用 `GET /cgi-bin/media/get` 获取临时素材文件。media_id仅三天内有效，注意要及时获取以免过期。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **media_id**（必填）：通过上传临时素材或异步上传临时素材获取到的媒体文件ID，3天内有效，media_id在同一企业内所有应用之间可以共享。

## 输出

返回媒体文件的 base64 编码数据、content_type、filename、size。
