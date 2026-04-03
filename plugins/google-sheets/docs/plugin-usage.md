# Google Sheets Atomemo 插件使用说明

本插件通过 OAuth2 调用 [Google Sheets API v4](https://developers.google.com/sheets/api/reference/rest)，Node 客户端为 `@googleapis/sheets`。下文中的 **Atomemo 参数** 为工作流里配置的字段名（蛇形命名）；**API 字段** 为传入 googleapis 的 REST 参数名（驼峰命名），取值须与官方文档一致。

## 前置条件

1. 在 Google Cloud Console 创建 OAuth 2.0 客户端（Web 应用或桌面应用，按 Atomemo 授权回调要求配置）。
2. 在 Atomemo 中新增凭证类型 **Google Sheets OAuth2**，填写 `client_id`、`client_secret`，完成授权（需要 `spreadsheets` 与只读 Drive 等范围，见插件内 `DEFAULT_SCOPES`）。
3. 在每个工具中选择已授权的 **credential_id**。

## 参数约定

- **spreadsheet_id**：表格 ID（来自表格 URL 中 `/d/{spreadsheetId}/`）。
- **range**：A1 表示法，例如 `Sheet1!A1:D10`（须与 [REST 文档](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get) 一致）。
- **values**：对应 REST 中 `ValueRange.values`，二维数组；在 UI 中可为 JSON 字符串或表达式解析后的数组。

校验失败或 Google 返回错误时，工具会抛出带可读信息的 `Error`（入参由 Zod 校验；API 错误经统一包装）。

---

## 工具一览

| 工具 name（Atomemo） | googleapis 方法 | REST 方法摘要 |
|----------------------|-----------------|---------------|
| `google-sheets-read-rows` | `spreadsheets.values.get` | `GET .../values/{range}` |
| `google-sheets-update-rows` | `spreadsheets.values.update` | `PUT .../values/{range}` |
| `google-sheets-append-rows` | `spreadsheets.values.append` | `POST .../values/{range}:append` |
| `google-sheets-clear-values` | `spreadsheets.values.clear` | `POST .../values/{range}:clear` |
| `google-sheets-batch-get-values` | `spreadsheets.values.batchGet` | `GET .../values:batchGet` |
| `google-sheets-create-spreadsheet` | `spreadsheets.create` | `POST /v4/spreadsheets` |
| `google-sheets-get-spreadsheet-info` | `spreadsheets.get` | `GET /v4/spreadsheets/{id}` |
| `google-sheets-copy-sheet` | `spreadsheets.sheets.copyTo` | `POST .../sheets/{sheetId}:copyTo` |

---

## 各工具参数与示例

### 1. `google-sheets-read-rows`（读取单个范围）

| Atomemo 参数 | API 字段 | 说明 |
|--------------|----------|------|
| credential_id | — | 凭证选择，非 Google API 字段 |
| spreadsheet_id | spreadsheetId | 表格 ID |
| range | range | A1 范围 |
| major_dimension | majorDimension | 可选，默认 `ROWS`；`ROWS` \| `COLUMNS` |
| value_render_option | valueRenderOption | 可选，默认 `FORMATTED_VALUE`；`FORMATTED_VALUE` \| `UNFORMATTED_VALUE` \| `FORMULA` |

示例（参数 JSON 概念示例）：

```json
{
  "credential_id": "你的凭证 ID",
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "range": "Sheet1!A1:C10",
  "major_dimension": "ROWS",
  "value_render_option": "FORMATTED_VALUE"
}
```

### 2. `google-sheets-update-rows`（覆盖写入范围）

| Atomemo 参数 | API 字段 | 说明 |
|--------------|----------|------|
| spreadsheet_id | spreadsheetId | 表格 ID |
| range | range | 写入目标 A1 范围 |
| value_input_option | valueInputOption | 可选，默认 `USER_ENTERED`；`RAW` \| `USER_ENTERED` |
| values | requestBody.values | 二维数组（`ValueRange.values`） |

请求体中插件固定传入 `majorDimension: "ROWS"`，与 `requestBody.range` 一并交给 API。

```json
{
  "credential_id": "你的凭证 ID",
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "range": "Sheet1!A1:B2",
  "value_input_option": "USER_ENTERED",
  "values": "[[\"姓名\",\"年龄\"],[\"Alice\",\"30\"]]"
}
```

### 3. `google-sheets-append-rows`（追加行）

| Atomemo 参数 | API 字段 | 说明 |
|--------------|----------|------|
| spreadsheet_id | spreadsheetId | 表格 ID |
| range | range | 用于定位表格的 A1 范围（如 `Sheet1!A:D`） |
| value_input_option | valueInputOption | 同上 |
| insert_data_option | insertDataOption | 可选，默认 `INSERT_ROWS`；`OVERWRITE` \| `INSERT_ROWS` |
| values | requestBody.values | 二维数组 |

```json
{
  "credential_id": "你的凭证 ID",
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "range": "Sheet1!A:D",
  "value_input_option": "USER_ENTERED",
  "insert_data_option": "INSERT_ROWS",
  "values": "[[\"Bob\",\"25\"]]"
}
```

### 4. `google-sheets-clear-values`（清除范围）

| Atomemo 参数 | API 字段 |
|--------------|----------|
| spreadsheet_id | spreadsheetId |
| range | range |

```json
{
  "credential_id": "你的凭证 ID",
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "range": "Sheet1!A1:Z1000"
}
```

### 5. `google-sheets-batch-get-values`（批量读取）

| Atomemo 参数 | API 字段 | 说明 |
|--------------|----------|------|
| spreadsheet_id | spreadsheetId | 表格 ID |
| ranges | ranges | **逗号分隔**的多个 A1 范围，解析为 `string[]` |
| major_dimension | majorDimension | 同 read-rows |
| value_render_option | valueRenderOption | 同 read-rows |

```json
{
  "credential_id": "你的凭证 ID",
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "ranges": "Sheet1!A1:B2, Sheet2!A1:C5"
}
```

### 6. `google-sheets-create-spreadsheet`（新建表格）

| Atomemo 参数 | API 字段 | 说明 |
|--------------|----------|------|
| title | properties.title | 表格标题 |
| sheet_titles | sheets[].properties.title | 可选；逗号分隔多个工作表标题，按顺序设 `index` |

```json
{
  "credential_id": "你的凭证 ID",
  "title": "销售报表",
  "sheet_titles": "汇总,明细"
}
```

### 7. `google-sheets-get-spreadsheet-info`（元数据）

| Atomemo 参数 | API 字段 | 说明 |
|--------------|----------|------|
| spreadsheet_id | spreadsheetId | 表格 ID |
| include_grid_data | includeGridData | 可选；**仅当为布尔 `true` 时为 true**（缺省或未开启则为 false） |

```json
{
  "credential_id": "你的凭证 ID",
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "include_grid_data": false
}
```

### 8. `google-sheets-copy-sheet`（复制工作表到另一表格）

| Atomemo 参数 | API 字段 | 说明 |
|--------------|----------|------|
| spreadsheet_id | spreadsheetId | **源**表格 ID |
| sheet_id | sheetId | 源工作表数字 ID（整数，可从 get 接口的 `sheets[].properties.sheetId` 取得） |
| destination_spreadsheet_id | requestBody.destinationSpreadsheetId | **目标**表格 ID |

```json
{
  "credential_id": "你的凭证 ID",
  "spreadsheet_id": "源表格ID",
  "sheet_id": 0,
  "destination_spreadsheet_id": "目标表格ID"
}
```

---

## 更多参考

- 本仓库 [`google-sheets-api.md`](./google-sheets-api.md)：Sheets REST 能力总览（中文整理）。
- 官方 REST：[Spreadsheets](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets)、[Spreadsheet.Values](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values)。
