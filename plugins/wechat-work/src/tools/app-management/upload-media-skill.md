# 上传临时素材 (`wechat-work-upload-media`)

调用 `POST /cgi-bin/media/upload` 上传临时素材到企业微信，素材上传得到media_id，该media_id仅三天内有效，media_id在同一企业内应用之间可以共享。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **type**（必填）：媒体文件类型，分别有图片（image）、语音（voice）、视频（video），普通文件（file）。
- **media**（必填）：`file_ref`，要上传的媒体文件。

## 上传的媒体文件限制

所有文件size必须大于5个字节。

- 图片（image）：10MB，支持JPG,PNG格式
- 语音（voice）：2MB，播放长度不超过60s，仅支持AMR格式
- 视频（video）：10MB，支持MP4格式
- 普通文件（file）：20MB

## 输出

| 参数 | 说明 |
| --- | --- |
| type | 媒体文件类型，分别有图片（image）、语音（voice）、视频（video），普通文件(file) |
| media_id | 媒体文件上传后获取的唯一标识，3天内有效 |
| created_at | 媒体文件上传时间戳 |
