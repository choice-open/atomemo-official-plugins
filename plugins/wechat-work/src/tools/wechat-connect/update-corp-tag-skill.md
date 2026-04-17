# 编辑企业客户标签 (`wechat-work-update-corp-tag`)

调用 `POST /cgi-bin/externalcontact/edit_corp_tag` 编辑客户标签/标签组的名称或次序值。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **id**（必填）：标签或标签组的id。
- **name**（选填）：新的标签或标签组名称，最长为30个字符。
- **order**（选填）：标签/标签组的次序值。order值大的排序靠前。有效的值范围是[0, 2^32)。

注意：修改后的标签组不能和已有的标签组重名，标签也不能和同一标签组下的其他标签重名。

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
