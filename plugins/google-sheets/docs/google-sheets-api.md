# Google Sheets API v4 — Node.js 客户端完整参考

> 官方文档：https://developers.google.com/workspace/sheets/api/reference/rest
>
> Node.js 客户端库：`googleapis` (npm) / `@googleapis/sheets` (子模块)
>
> 服务端点：`https://sheets.googleapis.com`

---

## 目录

- [1. 概述](#1-概述)
- [2. 认证方式](#2-认证方式)
- [3. REST 资源与方法总览](#3-rest-资源与方法总览)
- [4. spreadsheets — 电子表格管理](#4-spreadsheets--电子表格管理)
- [5. spreadsheets.values — 单元格值读写](#5-spreadsheetsvalues--单元格值读写)
- [6. spreadsheets.sheets — 工作表操作](#6-spreadsheetssheets--工作表操作)
- [7. spreadsheets.developerMetadata — 开发者元数据](#7-spreadsheetsdevelopermetadata--开发者元数据)
- [8. batchUpdate 请求类型大全](#8-batchupdate-请求类型大全)
- [9. Node.js 使用示例](#9-nodejs-使用示例)
- [10. OAuth 权限范围](#10-oauth-权限范围)

---

## 1. 概述

Google Sheets API v4 提供了对 Google 电子表格的读写能力。API 按照 REST 资源组织为 **4 个模块**：

| 模块 | 说明 |
|---|---|
| `spreadsheets` | 电子表格级别操作（创建、获取、批量更新） |
| `spreadsheets.values` | 单元格值的读取、写入、追加、清除 |
| `spreadsheets.sheets` | 单个工作表的复制 |
| `spreadsheets.developerMetadata` | 开发者元数据的读取与搜索 |

---

## 2. 认证方式

| 方式 | 适用场景 |
|---|---|
| **OAuth 2.0** | 代替用户操作电子表格 |
| **API Key** | 仅读取公开电子表格 |
| **Service Account** | 服务端到服务端通信 |
| **Application Default Credentials** | GCP 环境自动认证 |

---

## 3. REST 资源与方法总览

| 资源 | 方法 | HTTP | 说明 |
|---|---|---|---|
| `spreadsheets` | `create` | POST | 创建电子表格 |
| `spreadsheets` | `get` | GET | 获取电子表格 |
| `spreadsheets` | `batchUpdate` | POST | 批量更新电子表格 |
| `spreadsheets` | `getByDataFilter` | POST | 按数据过滤器获取电子表格 |
| `spreadsheets.values` | `get` | GET | 读取单个范围的值 |
| `spreadsheets.values` | `batchGet` | GET | 批量读取多个范围的值 |
| `spreadsheets.values` | `batchGetByDataFilter` | POST | 按数据过滤器批量读取值 |
| `spreadsheets.values` | `update` | PUT | 写入单个范围的值 |
| `spreadsheets.values` | `batchUpdate` | POST | 批量写入多个范围的值 |
| `spreadsheets.values` | `batchUpdateByDataFilter` | POST | 按数据过滤器批量写入值 |
| `spreadsheets.values` | `append` | POST | 追加值到表格末尾 |
| `spreadsheets.values` | `clear` | POST | 清除单个范围的值 |
| `spreadsheets.values` | `batchClear` | POST | 批量清除多个范围的值 |
| `spreadsheets.values` | `batchClearByDataFilter` | POST | 按数据过滤器批量清除值 |
| `spreadsheets.sheets` | `copyTo` | POST | 复制工作表到另一电子表格 |
| `spreadsheets.developerMetadata` | `get` | GET | 获取指定 ID 的开发者元数据 |
| `spreadsheets.developerMetadata` | `search` | POST | 搜索匹配的开发者元数据 |

**共 4 个模块、17 个方法。**

---

## 4. spreadsheets — 电子表格管理

### 4.1 spreadsheets.create

创建一个新的电子表格。

- **HTTP**: `POST /v4/spreadsheets`
- **请求体**: `Spreadsheet` 对象（可包含 `properties.title`、`sheets` 等初始配置）
- **响应**: 返回新创建的 `Spreadsheet` 对象
- **Node.js**: `sheets.spreadsheets.create({ requestBody: { properties: { title } } })`

### 4.2 spreadsheets.get

获取指定电子表格的完整信息。

- **HTTP**: `GET /v4/spreadsheets/{spreadsheetId}`
- **路径参数**:
  - `spreadsheetId` — 电子表格 ID
- **查询参数**:
  - `ranges[]` — 要获取的范围（A1 表示法）
  - `includeGridData` — 是否包含网格数据（默认 `false`）
  - `excludeTablesInBandedRanges` — 是否排除带状区域中的表格
- **响应**: `Spreadsheet` 对象
- **Node.js**: `sheets.spreadsheets.get({ spreadsheetId, ranges, includeGridData })`

### 4.3 spreadsheets.batchUpdate

对电子表格执行一个或多个批量更新请求。这是执行结构化操作（添加/删除工作表、格式化、合并单元格等）的核心方法。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}:batchUpdate`
- **路径参数**:
  - `spreadsheetId` — 电子表格 ID
- **请求体**:
  - `requests[]` — 请求数组（见 [第 8 节](#8-batchupdate-请求类型大全)）
  - `includeSpreadsheetInResponse` — 是否在响应中包含更新后的电子表格
  - `responseRanges[]` — 响应中包含的范围
  - `responseIncludeGridData` — 响应中是否包含网格数据
- **响应**: `BatchUpdateSpreadsheetResponse`
- **Node.js**: `sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } })`

### 4.4 spreadsheets.getByDataFilter

使用数据过滤器获取电子表格。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}:getByDataFilter`
- **路径参数**:
  - `spreadsheetId` — 电子表格 ID
- **请求体**:
  - `dataFilters[]` — 数据过滤器数组
  - `includeGridData` — 是否包含网格数据
- **响应**: `Spreadsheet` 对象
- **Node.js**: `sheets.spreadsheets.getByDataFilter({ spreadsheetId, requestBody: { dataFilters } })`

---

## 5. spreadsheets.values — 单元格值读写

### 5.1 values.get

读取单个范围的值。

- **HTTP**: `GET /v4/spreadsheets/{spreadsheetId}/values/{range}`
- **路径参数**:
  - `spreadsheetId` — 电子表格 ID
  - `range` — A1 表示法范围（如 `Sheet1!A1:D5`）
- **查询参数**:
  - `majorDimension` — `ROWS`（默认）或 `COLUMNS`
  - `valueRenderOption` — `FORMATTED_VALUE`（默认）/ `UNFORMATTED_VALUE` / `FORMULA`
  - `dateTimeRenderOption` — `SERIAL_NUMBER` / `FORMATTED_STRING`（默认）
- **响应**: `ValueRange` 对象
- **Node.js**: `sheets.spreadsheets.values.get({ spreadsheetId, range })`

### 5.2 values.batchGet

批量读取多个范围的值。

- **HTTP**: `GET /v4/spreadsheets/{spreadsheetId}/values:batchGet`
- **查询参数**:
  - `ranges[]` — 多个 A1 范围
  - `majorDimension` / `valueRenderOption` / `dateTimeRenderOption` 同上
- **响应**: `BatchGetValuesResponse`（包含 `valueRanges[]`）
- **Node.js**: `sheets.spreadsheets.values.batchGet({ spreadsheetId, ranges })`

### 5.3 values.batchGetByDataFilter

按数据过滤器批量读取值。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}/values:batchGetByDataFilter`
- **请求体**:
  - `dataFilters[]` — 数据过滤器数组
  - `majorDimension` / `valueRenderOption` / `dateTimeRenderOption`
- **响应**: `BatchGetValuesByDataFilterResponse`
- **Node.js**: `sheets.spreadsheets.values.batchGetByDataFilter({ spreadsheetId, requestBody })`

### 5.4 values.update

写入单个范围的值。

- **HTTP**: `PUT /v4/spreadsheets/{spreadsheetId}/values/{range}`
- **路径参数**:
  - `spreadsheetId` / `range`
- **查询参数**:
  - `valueInputOption` — **必须**，`RAW` 或 `USER_ENTERED`
  - `includeValuesInResponse` — 是否返回更新后的值
  - `responseValueRenderOption` / `responseDateTimeRenderOption`
- **请求体**: `ValueRange` 对象
- **响应**: `UpdateValuesResponse`
- **Node.js**: `sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption, requestBody: { values } })`

### 5.5 values.batchUpdate

批量写入多个范围的值。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}/values:batchUpdate`
- **请求体**:
  - `valueInputOption` — `RAW` 或 `USER_ENTERED`
  - `data[]` — `ValueRange` 数组
  - `includeValuesInResponse` / `responseValueRenderOption` / `responseDateTimeRenderOption`
- **响应**: `BatchUpdateValuesResponse`
- **Node.js**: `sheets.spreadsheets.values.batchUpdate({ spreadsheetId, requestBody: { valueInputOption, data } })`

### 5.6 values.batchUpdateByDataFilter

按数据过滤器批量写入值。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}/values:batchUpdateByDataFilter`
- **请求体**:
  - `valueInputOption`
  - `data[]` — `DataFilterValueRange` 数组
- **响应**: `BatchUpdateValuesByDataFilterResponse`
- **Node.js**: `sheets.spreadsheets.values.batchUpdateByDataFilter({ spreadsheetId, requestBody })`

### 5.7 values.append

追加值到表格末尾。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}/values/{range}:append`
- **路径参数**:
  - `spreadsheetId` / `range` — range 用于查找表格边界
- **查询参数**:
  - `valueInputOption` — **必须**，`RAW` 或 `USER_ENTERED`
  - `insertDataOption` — `OVERWRITE` 或 `INSERT_ROWS`
  - `includeValuesInResponse` / `responseValueRenderOption` / `responseDateTimeRenderOption`
- **请求体**: `ValueRange` 对象
- **响应**: `AppendValuesResponse`
- **Node.js**: `sheets.spreadsheets.values.append({ spreadsheetId, range, valueInputOption, requestBody: { values } })`

### 5.8 values.clear

清除单个范围的值。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}/values/{range}:clear`
- **响应**: `ClearValuesResponse`
- **Node.js**: `sheets.spreadsheets.values.clear({ spreadsheetId, range })`

### 5.9 values.batchClear

批量清除多个范围的值。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}/values:batchClear`
- **请求体**:
  - `ranges[]` — 要清除的范围数组
- **响应**: `BatchClearValuesResponse`
- **Node.js**: `sheets.spreadsheets.values.batchClear({ spreadsheetId, requestBody: { ranges } })`

### 5.10 values.batchClearByDataFilter

按数据过滤器批量清除值。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}/values:batchClearByDataFilter`
- **请求体**:
  - `dataFilters[]` — 数据过滤器数组
- **响应**: `BatchClearValuesByDataFilterResponse`
- **Node.js**: `sheets.spreadsheets.values.batchClearByDataFilter({ spreadsheetId, requestBody })`

---

## 6. spreadsheets.sheets — 工作表操作

### 6.1 sheets.copyTo

将一个工作表复制到另一个电子表格中。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}/sheets/{sheetId}:copyTo`
- **路径参数**:
  - `spreadsheetId` — 源电子表格 ID
  - `sheetId` — 源工作表 ID
- **请求体**:
  - `destinationSpreadsheetId` — 目标电子表格 ID
- **响应**: `SheetProperties` 对象
- **Node.js**: `sheets.spreadsheets.sheets.copyTo({ spreadsheetId, sheetId, requestBody: { destinationSpreadsheetId } })`

---

## 7. spreadsheets.developerMetadata — 开发者元数据

开发者元数据允许将任意键值对关联到电子表格、工作表、行或列上，并在对象移动时保持关联。

### 7.1 developerMetadata.get

获取指定 ID 的开发者元数据。

- **HTTP**: `GET /v4/spreadsheets/{spreadsheetId}/developerMetadata/{metadataId}`
- **路径参数**:
  - `spreadsheetId` / `metadataId`
- **响应**: `DeveloperMetadata` 对象
- **Node.js**: `sheets.spreadsheets.developerMetadata.get({ spreadsheetId, metadataId })`

### 7.2 developerMetadata.search

搜索匹配指定 DataFilter 的所有开发者元数据。

- **HTTP**: `POST /v4/spreadsheets/{spreadsheetId}/developerMetadata:search`
- **请求体**:
  - `dataFilters[]` — 数据过滤器数组
- **响应**: `SearchDeveloperMetadataResponse`
- **Node.js**: `sheets.spreadsheets.developerMetadata.search({ spreadsheetId, requestBody: { dataFilters } })`

### DeveloperMetadata 资源结构

| 字段 | 类型 | 说明 |
|---|---|---|
| `metadataId` | integer | 元数据唯一 ID |
| `metadataKey` | string | 元数据键名 |
| `metadataValue` | string | 元数据值 |
| `location` | DeveloperMetadataLocation | 关联位置 |
| `visibility` | enum | `DOCUMENT`（文档可见）/ `PROJECT`（仅项目可见） |

**位置类型**: `ROW` / `COLUMN` / `SHEET` / `SPREADSHEET`

---

## 8. batchUpdate 请求类型大全

`spreadsheets.batchUpdate` 的 `requests[]` 数组支持以下所有请求类型：

### 工作表管理

| 请求类型 | 说明 |
|---|---|
| `AddSheetRequest` | 添加新工作表 |
| `DeleteSheetRequest` | 删除工作表 |
| `DuplicateSheetRequest` | 复制工作表 |
| `UpdateSheetPropertiesRequest` | 更新工作表属性（名称、隐藏等） |
| `UpdateSpreadsheetPropertiesRequest` | 更新电子表格属性（标题、区域设置等） |

### 行列操作

| 请求类型 | 说明 |
|---|---|
| `InsertDimensionRequest` | 插入行或列 |
| `DeleteDimensionRequest` | 删除行或列 |
| `MoveDimensionRequest` | 移动行或列 |
| `AppendDimensionRequest` | 在末尾追加行或列 |
| `UpdateDimensionPropertiesRequest` | 更新行/列属性（高度、宽度等） |
| `AutoResizeDimensionsRequest` | 自动调整行/列大小 |
| `AddDimensionGroupRequest` | 添加行/列分组 |
| `DeleteDimensionGroupRequest` | 删除行/列分组 |
| `UpdateDimensionGroupRequest` | 更新行/列分组 |

### 单元格操作

| 请求类型 | 说明 |
|---|---|
| `UpdateCellsRequest` | 更新单元格数据和格式 |
| `RepeatCellRequest` | 在范围内重复设置单元格 |
| `AppendCellsRequest` | 追加单元格到工作表末尾 |
| `UpdateBordersRequest` | 更新单元格边框 |
| `MergeCellsRequest` | 合并单元格 |
| `UnmergeCellsRequest` | 取消合并单元格 |

### 数据操作

| 请求类型 | 说明 |
|---|---|
| `SortRangeRequest` | 对范围排序 |
| `SetDataValidationRequest` | 设置数据验证规则 |
| `SetBasicFilterRequest` | 设置基本筛选器 |
| `ClearBasicFilterRequest` | 清除基本筛选器 |
| `AutoFillRequest` | 自动填充 |
| `CutPasteRequest` | 剪切粘贴 |
| `CopyPasteRequest` | 复制粘贴 |
| `PasteDataRequest` | 粘贴数据（CSV/TSV） |
| `TextToColumnsRequest` | 文本分列 |
| `FindReplaceRequest` | 查找替换 |
| `TrimWhitespaceRequest` | 修剪空白字符 |
| `DeleteDuplicatesRequest` | 删除重复行 |
| `RandomizeRangeRequest` | 随机化范围顺序 |
| `InsertRangeRequest` | 插入范围 |
| `DeleteRangeRequest` | 删除范围 |

### 命名范围

| 请求类型 | 说明 |
|---|---|
| `AddNamedRangeRequest` | 添加命名范围 |
| `UpdateNamedRangeRequest` | 更新命名范围 |
| `DeleteNamedRangeRequest` | 删除命名范围 |

### 条件格式

| 请求类型 | 说明 |
|---|---|
| `AddConditionalFormatRuleRequest` | 添加条件格式规则 |
| `UpdateConditionalFormatRuleRequest` | 更新条件格式规则 |
| `DeleteConditionalFormatRuleRequest` | 删除条件格式规则 |

### 筛选视图

| 请求类型 | 说明 |
|---|---|
| `AddFilterViewRequest` | 添加筛选视图 |
| `UpdateFilterViewRequest` | 更新筛选视图 |
| `DeleteFilterViewRequest` | 删除筛选视图 |
| `DuplicateFilterViewRequest` | 复制筛选视图 |

### 受保护范围

| 请求类型 | 说明 |
|---|---|
| `AddProtectedRangeRequest` | 添加受保护范围 |
| `UpdateProtectedRangeRequest` | 更新受保护范围 |
| `DeleteProtectedRangeRequest` | 删除受保护范围 |

### 图表

| 请求类型 | 说明 |
|---|---|
| `AddChartRequest` | 添加图表 |
| `UpdateChartSpecRequest` | 更新图表规格 |
| `UpdateEmbeddedObjectPositionRequest` | 更新嵌入对象位置 |
| `UpdateEmbeddedObjectBorderRequest` | 更新嵌入对象边框 |
| `DeleteEmbeddedObjectRequest` | 删除嵌入对象 |

### 带状区域（Banding）

| 请求类型 | 说明 |
|---|---|
| `AddBandingRequest` | 添加带状区域 |
| `UpdateBandingRequest` | 更新带状区域 |
| `DeleteBandingRequest` | 删除带状区域 |

### 开发者元数据

| 请求类型 | 说明 |
|---|---|
| `CreateDeveloperMetadataRequest` | 创建开发者元数据 |
| `UpdateDeveloperMetadataRequest` | 更新开发者元数据 |
| `DeleteDeveloperMetadataRequest` | 删除开发者元数据 |

### 切片器（Slicer）

| 请求类型 | 说明 |
|---|---|
| `AddSlicerRequest` | 添加切片器 |
| `UpdateSlicerSpecRequest` | 更新切片器规格 |

### 数据源

| 请求类型 | 说明 |
|---|---|
| `AddDataSourceRequest` | 添加数据源 |
| `UpdateDataSourceRequest` | 更新数据源 |
| `DeleteDataSourceRequest` | 删除数据源 |
| `RefreshDataSourceRequest` | 刷新数据源 |
| `CancelDataSourceRefreshRequest` | 取消数据源刷新 |

### 表格（Table）

| 请求类型 | 说明 |
|---|---|
| `AddTableRequest` | 添加表格 |
| `UpdateTableRequest` | 更新表格 |
| `DeleteTableRequest` | 删除表格 |

---

## 9. Node.js 使用示例

### 安装

```bash
# 完整包
npm install googleapis

# 或仅安装 Sheets 子模块（更轻量）
npm install @googleapis/sheets
```

### 初始化客户端

```typescript
import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
  keyFile: '/path/to/service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })
```

### 创建电子表格

```typescript
const res = await sheets.spreadsheets.create({
  requestBody: {
    properties: { title: 'My New Spreadsheet' },
  },
})
console.log(`Created: ${res.data.spreadsheetId}`)
```

### 读取值

```typescript
const res = await sheets.spreadsheets.values.get({
  spreadsheetId: 'SPREADSHEET_ID',
  range: 'Sheet1!A1:D10',
})
console.log(res.data.values)
```

### 写入值

```typescript
await sheets.spreadsheets.values.update({
  spreadsheetId: 'SPREADSHEET_ID',
  range: 'Sheet1!A1',
  valueInputOption: 'USER_ENTERED',
  requestBody: {
    values: [
      ['Name', 'Age', 'City'],
      ['Alice', 30, 'Beijing'],
      ['Bob', 25, 'Shanghai'],
    ],
  },
})
```

### 追加行

```typescript
await sheets.spreadsheets.values.append({
  spreadsheetId: 'SPREADSHEET_ID',
  range: 'Sheet1!A:D',
  valueInputOption: 'USER_ENTERED',
  requestBody: {
    values: [['Charlie', 28, 'Guangzhou']],
  },
})
```

### 批量更新（添加工作表 + 格式化）

```typescript
await sheets.spreadsheets.batchUpdate({
  spreadsheetId: 'SPREADSHEET_ID',
  requestBody: {
    requests: [
      {
        addSheet: {
          properties: { title: 'NewSheet', index: 1 },
        },
      },
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
          cell: {
            userEnteredFormat: {
              textFormat: { bold: true },
            },
          },
          fields: 'userEnteredFormat.textFormat.bold',
        },
      },
    ],
  },
})
```

---

## 10. OAuth 权限范围

| 权限范围 | 说明 |
|---|---|
| `https://www.googleapis.com/auth/spreadsheets` | 读写所有电子表格 |
| `https://www.googleapis.com/auth/spreadsheets.readonly` | 只读所有电子表格 |
| `https://www.googleapis.com/auth/drive` | 读写所有 Drive 文件 |
| `https://www.googleapis.com/auth/drive.readonly` | 只读所有 Drive 文件 |
| `https://www.googleapis.com/auth/drive.file` | 仅操作应用创建/打开的文件 |
