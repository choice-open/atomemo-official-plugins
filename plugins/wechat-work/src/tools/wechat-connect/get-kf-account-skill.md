# 获取客服账号链接 (`wechat-work-get-kf-account`)

调用 `POST /cgi-bin/kf/add_contact_way` 获取带有不同参数的客服链接，微信用户点击链接即可向对应的客服账号发起咨询。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **open_kfid**（必填）：客服账号ID。
- **scene**（选填）：场景值，字符串类型，由开发者自定义。不多于32字节，取值范围：[0-9a-zA-Z_-]*。

## 输出

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errcode | int32 | 返回码 |
| errmsg | string | 对返回码的文本描述内容 |
| url | string | 客服链接，可嵌入到H5页面中，用户点击链接即可向对应的微信客服账号发起咨询 |
