# Google Search 插件使用说明

## 文档结构

| 章节 | 说明 |
|------|------|
| [插件使用说明](#插件使用说明) | 安装、配置凭据、在工作流中使用、典型场景 |
| [参数说明](#参数说明) | 各参数的详细说明与可选值 |
| [返回结构](#返回结构) | 工具输出的 JSON 结构 |
| [参数使用范例](#参数使用范例) | 常见查询示例 |
| [故障排查](#故障排查) | 常见问题与解决方法 |

---

## 插件使用说明

### 前置条件

- 已安装并运行 [Atomemo](https://atomemo.choiceform.com) 工作流平台
- 拥有 Google Cloud 项目，并已启用 **Custom Search API**
- 已在 [Programmable Search Engine](https://programmablesearchengine.google.com) 创建可编程搜索引擎

### 1. 安装插件

在 Atomemo 中通过插件市场添加 **Google Search** 插件。安装完成后，插件会提供一个搜索工具（`google-search`）和一个 API 凭据类型（`google-search-api`）。

### 2. 获取 API 凭证

#### 2.1 创建 API Key

1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建或选择项目
3. 启用 **Custom Search API**：在「API 和服务」→「库」中搜索并启用
4. 创建凭据：在「API 和服务」→「凭据」中创建 **API 密钥**
5. （可选）限制 API 密钥：仅允许调用 Custom Search API，并限制来源 IP

#### 2.2 创建搜索引擎 ID（Search Engine ID / cx）

1. 打开 [Programmable Search Engine](https://programmablesearchengine.google.com)
2. 点击「添加」创建新搜索引擎
3. 选择「搜索整个网络」或自定义站点
4. 创建完成后，在搜索引擎设置中获取 **搜索引擎 ID**（格式如 `xxxxxxxxxx:xxxxxxxxx`）

### 3. 配置 Google Search API 凭据

在 Atomemo 中配置凭据：

1. 在 Atomemo 的「凭据」或「设置」中新建凭据
2. 选择类型：**Google Search API**
3. 填写：
   - **API Key**（必填）：从 Google Cloud Console 获取的 API 密钥
   - **Search Engine ID**（必填）：从 Programmable Search Engine 获取的搜索引擎 ID
4. 保存并命名（如「生产环境 Google 搜索」）

### 4. 在工作流中使用

1. 在工作流编辑器中添加「工具」节点
2. 选择 **Google Search** 工具
3. 绑定已创建的 API 凭据
4. 填写 **搜索关键词**（query），并根据需要调整其他参数
5. 运行工作流，工具将返回搜索结果

### 5. 典型使用场景

| 场景 | 说明 |
|------|------|
| **信息检索** | 在工作流中根据上下文动态搜索，获取最新网页内容供后续节点使用 |
| **新闻监控** | 配合 `dateRestrict=d1` 或 `w1` 搜索当日/当周新闻 |
| **站内搜索** | 使用 `siteSearch` 将结果限制在指定域名（如 `github.com`） |
| **文档查找** | 使用 `fileType=pdf` 搜索 PDF 文档 |
| **多语言搜索** | 使用 `lr`（语言限制）和 `hl`（界面语言）获取特定语言结果 |
| **分页获取** | 使用 `start` 参数获取多页结果（每页最多 10 条） |

---

## 参数说明

### 必填参数

| 参数 | 类型 | 说明 |
|------|------|------|
| **API Credential** | credential_id | 选择已配置的 Google Search API 凭据 |
| **Search Query** | string | 搜索关键词，支持表达式引用上游节点数据 |

### 可选参数

#### 基础参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| **Number of Results** | number | 5 | 返回结果数量，1–10 |
| **Start Index** | number | 1 | 分页起始索引（1、11、21...），最大 91 |

#### 时间与排序

| 参数 | 类型 | 可选值 | 说明 |
|------|------|--------|------|
| **Date Restrict** | enum | d1, w1, m1, y1 | 时间限制：d1=一天内，w1=一周内，m1=一月内，y1=一年内 |
| **Sort** | enum | relevance, date | 排序方式：按相关性或按日期 |

#### 词项过滤

| 参数 | 类型 | 说明 |
|------|------|------|
| **Exact Terms** | string | 结果中必须包含的词组 |
| **Exclude Terms** | string | 从结果中排除的词或词组 |
| **OR Terms** | string | 至少出现其一的词，空格分隔 |

#### 地区与语言

| 参数 | 类型 | 说明 |
|------|------|------|
| **Geolocation (gl)** | string | 两位国家代码（如 us、cn、jp），用于提升本地相关性 |
| **Interface Language (hl)** | string | 界面语言代码（如 en、zh-CN） |
| **Language Restrict (lr)** | enum | 限制结果语言：lang_en、lang_zh-CN、lang_zh-TW、lang_ja、lang_ko |

#### 站点与文件类型

| 参数 | 类型 | 可选值 | 说明 |
|------|------|--------|------|
| **Site Search** | string | - | 将结果限制在指定站点（如 `github.com`） |
| **Site Filter** | enum | i, e | i=仅包含该站点，e=排除该站点 |
| **File Type** | enum | pdf, doc, xls, ppt, html | 限制为特定文件类型 |

#### 其他

| 参数 | 类型 | 可选值 | 说明 |
|------|------|--------|------|
| **SafeSearch** | enum | off, active | 是否启用安全搜索过滤 |
| **Duplicate Filter** | enum | 0, 1 | 0=关闭去重，1=开启去重过滤 |

---

## 返回结构

工具返回 JSON 对象，结构如下：

```json
{
  "totalResults": "12345",
  "results": [
    {
      "title": "页面标题",
      "link": "https://example.com/page",
      "snippet": "摘要文本...",
      "displayLink": "example.com"
    }
  ]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `totalResults` | string | 预估匹配总数 |
| `results` | array | 结果列表 |
| `results[].title` | string | 页面标题 |
| `results[].link` | string | 页面 URL |
| `results[].snippet` | string | 摘要片段 |
| `results[].displayLink` | string | 显示用域名 |

---

## 参数使用范例

### 基础搜索

```json
{
  "query": "TypeScript 教程",
  "num": 5
}
```

### 搜索最近一周的新闻

```json
{
  "query": "人工智能",
  "num": 10,
  "dateRestrict": "w1",
  "sort": "date"
}
```

### 在 GitHub 内搜索

```json
{
  "query": "atomemo plugin",
  "num": 5,
  "siteSearch": "github.com",
  "siteSearchFilter": "i"
}
```

### 搜索 PDF 文档

```json
{
  "query": "React 官方文档",
  "num": 5,
  "fileType": "pdf"
}
```

### 排除某些词

```json
{
  "query": "Python 教程",
  "excludeTerms": "视频 付费"
}
```

### 必须包含精确词组

```json
{
  "query": "machine learning",
  "exactTerms": "neural network"
}
```

### 获取第二页结果

```json
{
  "query": "JavaScript framework",
  "num": 10,
  "start": 11
}
```

### 中文结果 + 中国地区

```json
{
  "query": "大语言模型",
  "num": 5,
  "lr": "lang_zh-CN",
  "gl": "cn",
  "hl": "zh-CN"
}
```

### 组合：近期 + 站内 + 按日期排序

```json
{
  "query": "changelog",
  "siteSearch": "nodejs.org",
  "siteSearchFilter": "i",
  "dateRestrict": "m1",
  "sort": "date"
}
```

---

## 故障排查

| 现象 | 可能原因 | 建议 |
|------|----------|------|
| 401 / 403 错误 | API Key 无效、未启用 Custom Search API、配额超限 | 在 Cloud Console 检查 API 密钥、计费与配额 |
| 无结果返回 | 关键词过于小众、限制过严 | 放宽 `dateRestrict`、`siteSearch`、`lr` 等条件 |
| Search Engine ID 错误 | cx 填写错误、搜索引擎未生效 | 在 Programmable Search Engine 中核对 ID |
| 每日配额不足 | Custom Search 免费版每日 100 次 | 申请付费提升配额，或控制调用频率 |
| 凭据校验失败 | 凭据未选择或已失效 | 在工作流中重新选择有效凭据 |

### API 配额说明

- Google Custom Search JSON API 免费 tier：约 100 次/天
- 超出后需开通计费或申请更高配额
- 详见 [Custom Search API 定价](https://developers.google.com/custom-search/v1/overview#pricing)

---

## 参考链接

- [Custom Search JSON API 文档](https://developers.google.com/custom-search/v1/overview)
- [Programmable Search Engine](https://programmablesearchengine.google.com)
- [Google Cloud Console](https://console.cloud.google.com/)
