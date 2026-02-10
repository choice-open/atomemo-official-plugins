import type {
  PropertyArray,
  PropertyBoolean,
  PropertyDiscriminatedUnion,
  PropertyNumber,
  PropertyObject,
  PropertyString,
} from "@choiceopen/atomemo-plugin-sdk-js/types"

const formatItemParameter: PropertyDiscriminatedUnion<string, "type"> = {
  type: "discriminated_union",
  name: "type",
  discriminator: "type",
  any_of: [
    {
      name: "markdown-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "markdown",
        },
      ],
    },
    {
      name: "html-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "html",
        },
      ],
    },
    {
      name: "rawHtml-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "rawHtml",
        },
      ],
    },
    {
      name: "links-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "links",
        },
      ],
    },
    {
      name: "images-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "images",
        },
      ],
    },
    {
      name: "screenshot-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          display_name: {
            en_US: "Type",
            zh_Hans_CN: "类型",
          },
          constant: "screenshot",
          ui: {
            component: "select",
            support_expression: true,
          },
        },
        {
          name: "fullPage",
          type: "boolean",
          display_name: {
            en_US: "Full Page",
            zh_Hans_CN: "完整页面",
          },
          ui: {
            component: "switch",
            support_expression: true,
            hint: {
              en_US:
                "Whether to capture the full page or just the visible viewport.",
              zh_Hans_CN: "是否捕获整个页面还是仅可见视口。",
            },
          },
        },
        {
          name: "quality",
          type: "number",
          display_name: {
            en_US: "Quality",
            zh_Hans_CN: "质量",
          },
          default: 100,
          ui: {
            component: "number-input",
            support_expression: true,
            hint: {
              en_US: "Quality of the screenshot (0-100).",
              zh_Hans_CN: "截图质量（0-100）。",
            },
          },
        },
        {
          name: "viewport",
          type: "object",
          display_name: {
            en_US: "Viewport",
            zh_Hans_CN: "视口",
          },
          properties: [
            {
              name: "width",
              type: "number",
              default: 1280,
              display_name: {
                en_US: "Width",
                zh_Hans_CN: "宽度",
              },
              ui: {
                component: "number-input",
                support_expression: true,
                hint: {
                  en_US: "Width of the viewport in pixels.",
                  zh_Hans_CN: "视口的宽度（像素）。",
                },
              },
            },
            {
              name: "height",
              type: "number",
              default: 800,
              display_name: {
                en_US: "Height",
                zh_Hans_CN: "高度",
              },
              ui: {
                component: "number-input",
                support_expression: true,
                hint: {
                  en_US: "Height of the viewport in pixels.",
                  zh_Hans_CN: "视口的高度（像素）。",
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: "summary-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "summary",
        },
      ],
    },
    {
      name: "change-tracking-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          display_name: {
            en_US: "Type",
            zh_Hans_CN: "类型",
          },
          constant: "changeTracking",
          ui: {
            component: "select",
            support_expression: true,
          },
        },
        {
          name: "modes",
          type: "array",
          display_name: {
            en_US: "Modes",
            zh_Hans_CN: "模式",
          },
          default: ["git-diff"],
          items: {
            name: "mode",
            type: "string",
            enum: ["git-diff", "json"],
          },
          ui: {
            component: "multi-select",
            hint: {
              en_US: "Modes for tracking changes (git-diff or json).",
              zh_Hans_CN: "跟踪更改的模式（git-diff 或 json）。",
            },
          },
        },
        {
          name: "prompt",
          type: "string",
          display_name: {
            en_US: "Prompt",
            zh_Hans_CN: "提示词",
          },
          ui: {
            component: "textarea",
            support_expression: true,
            hint: {
              en_US: "Prompt for the LLM to analyze changes.",
              zh_Hans_CN: "用于 LLM 分析更改的提示词。",
            },
          },
        },
        {
          name: "tag",
          type: "string",
          display_name: {
            en_US: "Tag",
            zh_Hans_CN: "标签",
          },
          ui: {
            component: "input",
            support_expression: true,
            hint: {
              en_US: "Tag for identifying the change tracking instance.",
              zh_Hans_CN: "用于标识更改跟踪实例的标签。",
            },
          },
        },
        {
          name: "schema",
          type: "string",
          display_name: {
            en_US: "Schema",
            zh_Hans_CN: "数据格式",
          },
          ui: {
            component: "code-editor",
            support_expression: true,
            language: "json",
            hint: {
              en_US: "JSON schema for the change tracking data.",
              zh_Hans_CN: "更改跟踪数据的 JSON 模式。",
            },
          },
          default: "{}",
        },
      ],
    },
    {
      name: "json-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          display_name: {
            en_US: "Type",
            zh_Hans_CN: "类型",
          },
          constant: "json",
        },
        {
          name: "prompt",
          type: "string",
          display_name: {
            en_US: "Prompt",
            zh_Hans_CN: "提示词",
          },
          ui: {
            component: "textarea",
            support_expression: true,
            hint: {
              en_US:
                "Prompt to guide the LLM in extracting structured data from the page content.",
              zh_Hans_CN: "指导 LLM 从页面内容中提取结构化数据的提示词。",
            },
          },
        },
        {
          name: "schema",
          type: "string",
          display_name: {
            en_US: "Schema",
            zh_Hans_CN: "数据格式",
          },
          ui: {
            component: "code-editor",
            support_expression: true,
            language: "json",
            hint: {
              en_US:
                "JSON schema defining the structure of the data to extract.",
              zh_Hans_CN: "定义要提取的数据结构的 JSON 模式。",
            },
          },
          default: "{}",
        },
      ],
    },
    {
      name: "attributes-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "attributes",
        },
      ],
    },
    {
      name: "branding-format",
      type: "object",
      properties: [
        {
          name: "type",
          type: "string",
          constant: "branding",
        },
      ],
    },
  ],
  discriminator_ui: {
    component: "select",
  },
}

const formatsParameter: PropertyArray = {
  name: "formats",
  type: "array",
  display_name: {
    en_US: "Formats",
    zh_Hans_CN: "格式",
  },
  items: formatItemParameter,
  ui: {
    component: "array-section",
    hint: {
      en_US:
        "Output formats to include in the response. You can specify one or more formats, either as strings (e.g., 'markdown') or as objects with additional options (e.g., { type: 'json', schema: {...} }). Some formats require specific options to be set.",
      zh_Hans_CN:
        "响应中包含的输出格式。您可以指定一个或多个格式，可以是字符串（例如 'markdown'）或带有附加选项的对象（例如 { type: 'json', schema: {...} }）。某些格式需要设置特定选项。",
    },
  },
}

const headersParameter: PropertyObject<"headers"> = {
  name: "headers",
  type: "object",
  display_name: {
    en_US: "Headers",
    zh_Hans_CN: "请求头",
  },
  properties: [],
  additional_properties: {
    type: "string",
    name: "header-value",
  },
  ui: {
    component: "section",
    hint: {
      en_US:
        "Headers to send with the request. Can be used to send cookies, user-agent, etc.",
      zh_Hans_CN: "随请求发送的请求头。可用于发送 cookies、user-agent 等。",
    },
  },
}

const actionsParameter: PropertyArray = {
  name: "actions",
  type: "array",
  display_name: {
    en_US: "Actions",
    zh_Hans_CN: "操作",
  },
  items: {
    type: "discriminated_union",
    discriminator: "type",
    name: "type",
    any_of: [
      {
        name: "wait-action",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            display_name: {
              en_US: "Type",
              zh_Hans_CN: "类型",
            },
            constant: "wait",
            ui: {
              component: "select",
            },
          },
          {
            name: "milliseconds",
            type: "number",
            display_name: {
              en_US: "Milliseconds",
              zh_Hans_CN: "毫秒",
            },
            default: 1000,
            ui: {
              component: "number-input",
              support_expression: true,
              hint: {
                en_US: "Number of milliseconds to wait.",
                zh_Hans_CN: "等待的毫秒数。",
              },
            },
          },
          {
            name: "selector",
            type: "string",
            display_name: {
              en_US: "Selector",
              zh_Hans_CN: "选择器",
            },
            ui: {
              component: "input",
              support_expression: true,
              hint: {
                en_US: "CSS selector to wait for before proceeding.",
                zh_Hans_CN: "在继续之前等待的 CSS 选择器。",
              },
            },
          },
        ],
      },
      {
        name: "screenshot-action",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            display_name: {
              en_US: "Type",
              zh_Hans_CN: "类型",
            },
            constant: "screenshot",
            ui: {
              component: "select",
            },
          },
          {
            name: "fullPage",
            type: "boolean",
            display_name: {
              en_US: "Full Page",
              zh_Hans_CN: "完整页面",
            },
            ui: {
              component: "switch",
              support_expression: true,
              hint: {
                en_US:
                  "Whether to capture the full page or just the visible viewport.",
                zh_Hans_CN: "是否捕获整个页面还是仅可见视口。",
              },
            },
          },
          {
            name: "quality",
            type: "number",
            display_name: {
              en_US: "Quality",
              zh_Hans_CN: "质量",
            },
            default: 100,
            ui: {
              component: "number-input",
              support_expression: true,
              hint: {
                en_US: "Quality of the screenshot (0-100).",
                zh_Hans_CN: "截图质量（0-100）。",
              },
            },
          },
          {
            name: "viewport",
            type: "object",
            display_name: {
              en_US: "Viewport",
              zh_Hans_CN: "视口",
            },
            properties: [
              {
                name: "width",
                type: "number",
                default: 1280,
                display_name: {
                  en_US: "Width",
                  zh_Hans_CN: "宽度",
                },
                ui: {
                  component: "number-input",
                  support_expression: true,
                  hint: {
                    en_US: "Width of the viewport in pixels.",
                    zh_Hans_CN: "视口的宽度（像素）。",
                  },
                },
              },
              {
                name: "height",
                type: "number",
                default: 800,
                display_name: {
                  en_US: "Height",
                  zh_Hans_CN: "高度",
                },
                ui: {
                  component: "number-input",
                  support_expression: true,
                  hint: {
                    en_US: "Height of the viewport in pixels.",
                    zh_Hans_CN: "视口的高度（像素）。",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        name: "click-action",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            display_name: {
              en_US: "Type",
              zh_Hans_CN: "类型",
            },
            constant: "click",
            ui: {
              component: "select",
            },
          },
          {
            name: "selector",
            type: "string",
            display_name: {
              en_US: "Selector",
              zh_Hans_CN: "选择器",
            },
            required: true,
            ui: {
              component: "input",
              support_expression: true,
              hint: {
                en_US: "CSS selector of the element to click.",
                zh_Hans_CN: "要点击的元素的 CSS 选择器。",
              },
            },
          },
        ],
      },
      {
        name: "write-action",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            display_name: {
              en_US: "Type",
              zh_Hans_CN: "类型",
            },
            constant: "write",
            ui: {
              component: "select",
            },
          },
          {
            name: "text",
            type: "string",
            display_name: {
              en_US: "Text",
              zh_Hans_CN: "文本",
            },
            required: true,
            ui: {
              component: "input",
              support_expression: true,
              hint: {
                en_US: "Text to write into the input field.",
                zh_Hans_CN: "要写入输入字段的文本。",
              },
            },
          },
        ],
      },
      {
        name: "press-action",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            display_name: {
              en_US: "Type",
              zh_Hans_CN: "类型",
            },
            constant: "press",
            ui: {
              component: "select",
            },
          },
          {
            name: "key",
            type: "string",
            display_name: {
              en_US: "Key",
              zh_Hans_CN: "按键",
            },
            required: true,
            ui: {
              component: "input",
              support_expression: true,
              hint: {
                en_US: "Key to press (e.g., 'Enter', 'Tab').",
                zh_Hans_CN: "要按下的键（例如 'Enter'、'Tab'）。",
              },
            },
          },
        ],
      },
      {
        name: "scroll-action",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            display_name: {
              en_US: "Type",
              zh_Hans_CN: "类型",
            },
            constant: "scroll",
            ui: {
              component: "select",
            },
          },
          {
            name: "direction",
            type: "string",
            display_name: {
              en_US: "Direction",
              zh_Hans_CN: "方向",
            },
            default: "down",
            enum: ["up", "down"],
            required: true,
            ui: {
              component: "select",
              support_expression: true,
              options: [
                {
                  label: {
                    en_US: "Up",
                    zh_Hans_CN: "上",
                  },
                  value: "up",
                },
                {
                  label: {
                    en_US: "Down",
                    zh_Hans_CN: "下",
                  },
                  value: "down",
                },
              ],
              hint: {
                en_US: "Direction to scroll (up or down).",
                zh_Hans_CN: "滚动方向（上或下）。",
              },
            },
          },
          {
            name: "selector",
            type: "string",
            display_name: {
              en_US: "Selector",
              zh_Hans_CN: "选择器",
            },
            ui: {
              component: "input",
              support_expression: true,
              hint: {
                en_US:
                  "CSS selector of the element to scroll. If not provided, scrolls the entire page.",
                zh_Hans_CN:
                  "要滚动的元素的 CSS 选择器。如果未提供，则滚动整个页面。",
              },
            },
          },
        ],
      },
      {
        name: "scrape-action",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            display_name: {
              en_US: "Type",
              zh_Hans_CN: "类型",
            },
            constant: "scrape",
            ui: {
              component: "select",
            },
          },
        ],
      },
      {
        name: "execute-javascript-action",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            display_name: {
              en_US: "Type",
              zh_Hans_CN: "类型",
            },
            constant: "executeJavascript",
            ui: {
              component: "select",
            },
          },
          {
            name: "script",
            type: "string",
            display_name: {
              en_US: "Script",
              zh_Hans_CN: "脚本",
            },
            required: true,
            ui: {
              component: "code-editor",
              support_expression: true,
              language: "javascript",
              hint: {
                en_US: "JavaScript code to execute on the page.",
                zh_Hans_CN: "要在页面上执行的 JavaScript 代码。",
              },
            },
          },
        ],
      },
      {
        name: "pdf-action",
        type: "object",
        properties: [
          {
            name: "type",
            type: "string",
            display_name: {
              en_US: "Type",
              zh_Hans_CN: "类型",
            },
            constant: "pdf",
            ui: {
              component: "select",
            },
          },
          {
            name: "format",
            type: "string",
            display_name: {
              en_US: "Format",
              zh_Hans_CN: "格式",
            },
            enum: [
              "A0",
              "A1",
              "A2",
              "A3",
              "A4",
              "A5",
              "A6",
              "Letter",
              "Legal",
              "Tabloid",
              "Ledger",
            ],
            ui: {
              component: "select",
              support_expression: true,
              hint: {
                en_US: "Paper format for the PDF.",
                zh_Hans_CN: "PDF 的纸张格式。",
              },
            },
          },
          {
            name: "landscape",
            type: "boolean",
            display_name: {
              en_US: "Landscape",
              zh_Hans_CN: "横向",
            },
            ui: {
              component: "switch",
              support_expression: true,
              hint: {
                en_US: "Whether to use landscape orientation.",
                zh_Hans_CN: "是否使用横向方向。",
              },
            },
          },
          {
            name: "scale",
            type: "number",
            display_name: {
              en_US: "Scale",
              zh_Hans_CN: "缩放",
            },
            default: 1,
            ui: {
              component: "number-input",
              support_expression: true,
              hint: {
                en_US: "Scale factor for the PDF content.",
                zh_Hans_CN: "PDF 内容的缩放因子。",
              },
            },
          },
        ],
      },
    ],
    discriminator_ui: {
      component: "select",
    },
  } satisfies PropertyDiscriminatedUnion<string, "type">,
  ui: {
    component: "array-section",
    hint: {
      en_US: "Actions to perform on the page before grabbing the content",
      zh_Hans_CN: "在抓取内容之前在页面上执行的操作",
    },
  },
}

const locationParameter: PropertyObject = {
  name: "location",
  type: "object",
  display_name: {
    en_US: "Location",
    zh_Hans_CN: "位置",
  },
  properties: [
    {
      // ISO 3166-1 alpha-2 country code
      name: "country",
      type: "string",
      display_name: {
        en_US: "Country",
        zh_Hans_CN: "国家",
      },
      default: "US",
      ui: {
        component: "input",
        support_expression: true,
        hint: {
          en_US: "ISO 3166-1 alpha-2 country code",
          zh_Hans_CN: "ISO 3166-1 alpha-2 国家代码",
        },
      },
    },
    {
      name: "languages",
      type: "array",
      display_name: {
        en_US: "Languages",
        zh_Hans_CN: "语言",
      },
      items: {
        name: "language",
        type: "string",
      },
      ui: {
        component: "tag-input",
      },
    },
  ],
  ui: {
    component: "section",
    hint: {
      en_US:
        "Location settings for the request. When specified, this will use an appropriate proxy if available and emulate the corresponding language and timezone settings. Defaults to 'US' if not specified.",
      zh_Hans_CN:
        "请求的位置设置。如果指定，将使用适当的代理（如果可用）并模拟相应的语言和时区设置。如果未指定，则默认为 'US'。",
    },
  },
}

const onlyMainContentParameter: PropertyBoolean = {
  name: "onlyMainContent",
  type: "boolean",
  display_name: {
    en_US: "Only Main Content",
    zh_Hans_CN: "仅主要内容",
  },
  default: true,
  ui: {
    component: "switch",
    support_expression: true,
    hint: {
      en_US:
        "Only return the main content of the page excluding headers, navs, footers, etc.",
      zh_Hans_CN: "仅返回页面的主要内容，排除页眉、导航、页脚等。",
    },
  },
}

const removeBase64ImagesParameter: PropertyBoolean = {
  name: "removeBase64Images",
  type: "boolean",
  display_name: {
    en_US: "Remove Base64 Images",
    zh_Hans_CN: "移除 Base64 图片",
  },
  default: true,
  ui: {
    component: "switch",
    support_expression: true,
    hint: {
      en_US:
        "Removes all base 64 images from the output, which may be overwhelmingly long. The image's alt text remains in the output, but the URL is replaced with a placeholder.",
      zh_Hans_CN:
        "从输出中移除所有 base64 图片，这些图片可能非常长。图片的 alt 文本保留在输出中，但 URL 被替换为占位符。",
    },
  },
}

const timeoutParameter: PropertyNumber = {
  name: "timeout",
  type: "number",
  display_name: {
    en_US: "Timeout (ms)",
    zh_Hans_CN: "超时时间（毫秒）",
  },
  ui: {
    component: "number-input",
    support_expression: true,
    hint: {
      en_US: "Timeout in milliseconds for the request.",
      zh_Hans_CN: "请求的超时时间（毫秒）。",
    },
  },
}

const mobileParameter: PropertyBoolean = {
  name: "mobile",
  type: "boolean",
  default: false,
  display_name: {
    en_US: "Mobile",
    zh_Hans_CN: "移动端",
  },
  ui: {
    component: "switch",
    support_expression: true,
    hint: {
      en_US:
        "Set to true if you want to emulate scraping from a mobile device. Useful for testing responsive pages and taking mobile screenshots.",
      zh_Hans_CN:
        "如果您想模拟从移动设备抓取，请设置为 true。有助于测试响应式页面和拍摄移动截图。",
    },
  },
}

const blockAdsParameter: PropertyBoolean = {
  name: "blockAds",
  type: "boolean",
  default: true,
  display_name: {
    en_US: "Block Ads",
    zh_Hans_CN: "阻止广告",
  },
  ui: {
    component: "switch",
    support_expression: true,
    hint: {
      en_US: "Enables ad-blocking and cookie popup blocking.",
      zh_Hans_CN: "启用广告拦截和 cookie 弹窗拦截。",
    },
  },
}

const waitForParameter: PropertyNumber = {
  name: "waitFor",
  type: "number",
  display_name: {
    en_US: "Wait For (ms)",
    zh_Hans_CN: "等待时间（毫秒）",
  },
  ui: {
    component: "number-input",
    support_expression: true,
    hint: {
      en_US:
        "Specify a delay in milliseconds before fetching the content, allowing the page sufficient time to load. This waiting time is in addition to Firecrawl's smart wait feature.",
      zh_Hans_CN:
        "在获取内容之前指定延迟毫秒数，让页面有足够的时间加载。此等待时间是 Firecrawl 智能等待功能的额外时间。",
    },
  },
}

const storeInCacheParameter: PropertyBoolean = {
  name: "storeInCache",
  type: "boolean",
  default: true,
  display_name: {
    en_US: "Store in Cache",
    zh_Hans_CN: "缓存结果",
  },
  ui: {
    component: "switch",
    support_expression: true,
    hint: {
      en_US:
        "If true, the page will be stored in the Firecrawl index and cache. Setting this to false is useful if your scraping activity may have data protection concerns. Using some parameters associated with sensitive scraping (e.g. actions, headers) will force this parameter to be false.",
      zh_Hans_CN:
        "如果为 true，页面将被存储在 Firecrawl 索引和缓存中。如果您的抓取活动可能涉及数据保护问题，将此设置为 false 会很有用。使用一些与敏感抓取相关的参数（例如 actions、headers）将强制此参数为 false。",
    },
  },
}

const maxAgeParameter: PropertyNumber = {
  name: "maxAge",
  type: "integer",
  default: 172800000,
  display_name: {
    en_US: "Max Age (ms)",
    zh_Hans_CN: "最大存储时间（毫秒）",
  },
  ui: {
    component: "number-input",
    support_expression: true,
    step: 1,
    hint: {
      en_US:
        "Returns a cached version of the page if it is younger than this age in milliseconds. If a cached version of the page is older than this value, the page will be scraped. If you do not need extremely fresh data, enabling this can speed up your scrapes by 500%. Defaults to 2 days.",
      zh_Hans_CN:
        "如果页面的缓存版本比此年龄（毫秒）年轻，则返回缓存版本。如果缓存版本比此值旧，则将抓取页面。如果您不需要极其新鲜的数据，启用此功能可以使您的抓取速度提高 500%。默认为 2 天。",
    },
  },
}

const includeTagsParameter: PropertyArray = {
  name: "includeTags",
  type: "array",
  display_name: {
    en_US: "Include Tags",
    zh_Hans_CN: "包含标签",
  },
  items: {
    name: "tag",
    type: "string",
  },
  ui: {
    component: "tag-input",
    support_expression: true,
    hint: {
      en_US: "Tags to include in the output.",
      zh_Hans_CN: "输出中包含的标签。",
    },
  },
}

const excludeTagsParameter: PropertyArray = {
  name: "excludeTags",
  type: "array",
  display_name: {
    en_US: "Exclude Tags",
    zh_Hans_CN: "排除标签",
  },
  items: {
    name: "tag",
    type: "string",
  },
  ui: {
    component: "tag-input",
    support_expression: true,
    hint: {
      en_US: "Tags to exclude from the output.",
      zh_Hans_CN: "输出中排除的标签。",
    },
  },
}

const proxyParameter: PropertyString = {
  name: "proxy",
  type: "string",
  display_name: {
    en_US: "Proxy",
    zh_Hans_CN: "代理",
  },
  default: "auto",
  enum: ["basic", "stealth", "auto"],
  ui: {
    component: "select",
    support_expression: true,
    hint: {
      en_US:
        "Specifies the type of proxy to use. basic: Proxies for scraping sites with none to basic anti-bot solutions. Fast and usually works. stealth: Stealth proxies for scraping sites with advanced anti-bot solutions. Slower, but more reliable on certain sites. Costs up to 5 credits per request. auto: Firecrawl will automatically retry scraping with stealth proxies if the basic proxy fails. If the retry with stealth is successful, 5 credits will be billed for the scrape. If the first attempt with basic is successful, only the regular cost will be billed.",
      zh_Hans_CN:
        "指定使用的代理类型。basic：用于抓取具有无到基本反机器人解决方案的网站的代理。快速且通常有效。stealth：用于抓取具有高级反机器人解决方案的网站的隐秘代理。较慢，但在某些网站上更可靠。每个请求最多花费 5 个积分。auto：如果基本代理失败，Firecrawl 将自动使用隐秘代理重试抓取。如果使用隐秘重试成功，将为抓取计费 5 个积分。如果第一次使用基本代理成功，则仅计费常规费用。",
    },
  },
}

const skipTlsVerificationParameter: PropertyBoolean = {
  name: "skipTlsVerification",
  type: "boolean",
  default: true,
  display_name: {
    en_US: "Skip TLS Verification",
    zh_Hans_CN: "跳过 TLS 验证",
  },
  ui: {
    component: "switch",
    support_expression: true,
    hint: {
      en_US: "Skip TLS certificate verification when making requests.",
      zh_Hans_CN: "发出请求时跳过 TLS 证书验证。",
    },
  },
}

export const scrapeOptionsParameter: PropertyObject<"scrapeOptions"> = {
  name: "scrapeOptions",
  type: "object",
  ui: {
    component: "section",
  },
  display_name: {
    en_US: "Scrape Options",
    zh_Hans_CN: "爬取选项",
  },
  properties: [
    formatsParameter,
    onlyMainContentParameter,
    includeTagsParameter,
    excludeTagsParameter,
    headersParameter,
    waitForParameter,
    maxAgeParameter,
    mobileParameter,
    skipTlsVerificationParameter,
    timeoutParameter,
    actionsParameter,
    locationParameter,
    removeBase64ImagesParameter,
    blockAdsParameter,
    storeInCacheParameter,
    proxyParameter,
  ],
}
