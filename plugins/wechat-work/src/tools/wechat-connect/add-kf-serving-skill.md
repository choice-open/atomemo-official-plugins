# 添加接待人员 (`wechat-work-add-kf-serving`)

调用 `POST /cgi-bin/kf/servicer/add` 添加指定客服账号的接待人员，每个客服账号目前最多可添加2000个接待人员，20个部门。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| open_kfid | 是 | string | 客服账号ID |
| userid_list | 否 | string[] | 接待人员userid列表。第三方应用填密文userid，即open_userid。可填充个数：0~100，超过100个需分批调用 |
| department_id_list | 否 | int[] | 接待人员部门id列表。可填充个数：0~20 |

> userid_list 和 department_id_list 至少需要填其中一个

## 请求示例

```json
{
    "open_kfid": "kfxxxxxxxxxxxxxx",
    "userid_list": ["zhangsan", "lisi"],
    "department_id_list": [2, 4]
}
```

## 输出

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errcode | int | 返回码 |
| errmsg | string | 错误码描述 |
| result_list | array | 操作结果 |
| result_list[].userid | string | 接待人员的userid |
| result_list[].department_id | int | 接待人员部门的id |
| result_list[].errcode | int | 该项的添加结果 |
| result_list[].errmsg | string | 结果信息 |
