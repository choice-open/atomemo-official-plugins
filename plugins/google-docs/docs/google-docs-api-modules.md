# Google Docs API 模块与工具清单

> 基于 Google 官方文档整理：  
>
> - [https://developers.google.com/workspace/docs/api/reference/rest](https://developers.google.com/workspace/docs/api/reference/rest)  
> - [https://developers.google.com/workspace/docs/api/reference/rest/v1/documents](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents)  
> - [https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request)

## 概览

Google Docs API（`docs.googleapis.com`）当前 REST 参考的核心资源为 `v1.documents`。  
围绕该资源，最常用能力可以分为：

1. **文档生命周期模块**：创建、读取、批量更新文档
2. **文档结构模块**：正文、段落、表格、页眉页脚、脚注、命名范围、对象等
3. **批量编辑请求模块（batchUpdate requests）**：将具体编辑动作作为请求数组一次提交

---

## 1) 核心资源模块（REST Resource）

### `v1.documents`


| 方法                      | HTTP                                          | 作用            |
| ----------------------- | --------------------------------------------- | ------------- |
| `documents.create`      | `POST /v1/documents`                          | 创建空白文档（可指定标题） |
| `documents.get`         | `GET /v1/documents/{documentId}`              | 获取文档最新内容      |
| `documents.batchUpdate` | `POST /v1/documents/{documentId}:batchUpdate` | 原子化应用一组编辑请求   |


> 说明：`batchUpdate` 会先校验所有子请求，任一无效则整批失败。

---

## 2) 文档模型模块（Documents schema）

`Document` 及相关模型可按语义分为以下模块：


| 模块       | 代表对象（示例）                                                   | 用途            |
| -------- | ---------------------------------------------------------- | ------------- |
| 文档基础     | `Document`, `DocumentStyle`, `NamedStyles`                 | 文档标题、样式、全局结构  |
| 标签页（新能力） | `Tab`, `TabProperties`, `DocumentTab`                      | 多 Tab 文档内容组织  |
| 正文与段落    | `Body`, `StructuralElement`, `Paragraph`, `ParagraphStyle` | 正文文本与段落布局     |
| 文本样式     | `TextRun`, `TextStyle`, `Link`                             | 字体、颜色、链接、强调样式 |
| 列表与目录    | `List`, `ListProperties`, `TableOfContents`                | 有序/无序列表与目录结构  |
| 表格       | `Table`, `TableRow`, `TableCell`, `TableStyle`             | 表格内容与样式       |
| 页眉页脚与脚注  | `Header`, `Footer`, `Footnote`                             | 页面装饰和注释信息     |
| 范围与对象    | `NamedRanges`, `InlineObject`, `PositionedObject`          | 命名范围、图片/对象定位  |


---

## 3) 编辑工具模块（`documents.batchUpdate` 的 Request 类型）

下面这些即 Docs API 的“编辑工具箱”。实际调用时，把它们放进 `requests[]` 提交给 `documents.batchUpdate`。

### 文本与段落工具

- `ReplaceAllTextRequest`
- `InsertTextRequest`
- `UpdateTextStyleRequest`
- `CreateParagraphBulletsRequest`
- `DeleteParagraphBulletsRequest`
- `UpdateParagraphStyleRequest`
- `DeleteContentRangeRequest`
- `InsertPersonRequest`

### 范围与结构工具

- `CreateNamedRangeRequest`
- `DeleteNamedRangeRequest`
- `ReplaceNamedRangeContentRequest`
- `InsertSectionBreakRequest`
- `UpdateSectionStyleRequest`

### 表格工具

- `InsertTableRequest`
- `InsertTableRowRequest`
- `InsertTableColumnRequest`
- `DeleteTableRowRequest`
- `DeleteTableColumnRequest`
- `UpdateTableColumnPropertiesRequest`
- `UpdateTableCellStyleRequest`
- `UpdateTableRowStyleRequest`
- `MergeTableCellsRequest`
- `UnmergeTableCellsRequest`
- `PinTableHeaderRowsRequest`

### 图片与对象工具

- `InsertInlineImageRequest`
- `ReplaceImageRequest`
- `DeletePositionedObjectRequest`

### 页面与页眉页脚工具

- `InsertPageBreakRequest`
- `CreateHeaderRequest`
- `CreateFooterRequest`
- `CreateFootnoteRequest`
- `DeleteHeaderRequest`
- `DeleteFooterRequest`

### 文档与 Tab 管理工具

- `UpdateDocumentStyleRequest`
- `AddDocumentTabRequest`
- `DeleteTabRequest`
- `UpdateDocumentTabPropertiesRequest`

---

## 4) 鉴权范围（常用）

不同方法所需 scope 略有差异，常见包括：

- `https://www.googleapis.com/auth/documents`
- `https://www.googleapis.com/auth/documents.readonly`
- `https://www.googleapis.com/auth/drive`
- `https://www.googleapis.com/auth/drive.readonly`
- `https://www.googleapis.com/auth/drive.file`

---

## 5) 参考链接

- API 根参考：[https://developers.google.com/workspace/docs/api/reference/rest](https://developers.google.com/workspace/docs/api/reference/rest)
- `documents` 资源：[https://developers.google.com/workspace/docs/api/reference/rest/v1/documents](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents)
- `documents.batchUpdate`：[https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/batchUpdate](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/batchUpdate)
- `documents.request`（所有 Request 类型）：[https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request)
- 概览：[https://developers.google.com/workspace/docs/api/how-tos/overview](https://developers.google.com/workspace/docs/api/how-tos/overview)

---

## 6) 本插件实现与 API 对照（检修结论）

| 工具 | 对应 API | 参数与行为 | 状态 |
| --- | --- | --- | --- |
| `create-document` | `documents.create` | `title` → `requestBody.title`； OAuth scope 含 `documents` + `drive.file`，覆盖 create 所需范围。 | 已对齐；凭证查找键须为参数名 `google_credential`（与 SDK `args.credentials` 一致）。 |
| `get-document` | `documents.get` | `document_id` → 路径参数；`include_tabs_content` → `includeTabsContent`；`suggestions_view_mode`（可选）→ `suggestionsViewMode`，枚举与 REST 一致。 | 已对齐 |
| `batch-update-document` | `documents.batchUpdate` | `document_id` + `requests[]`；`write_control_json` 解析后仅在存在时加入 `writeControl`（与可选字段一致）。结构化 `insert_text` / `replace_all_text` / `update_text_style` 对应同名 Request 结构。 | 已对齐 |

**流程建议（与 API 设计一致）：** 先 `create-document` 取得 `documentId` → `batch-update-document` 写入 → `get-document` 校验；编辑并发场景可使用 `writeControl`（`requiredRevisionId` / `targetRevisionId`）。

