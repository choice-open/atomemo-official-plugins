import type {
  PropertyArray,
  PropertyBoolean,
  PropertyDiscriminatedUnion,
  PropertyNumber,
  PropertyObject,
  PropertyString,
} from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"

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
          display_name: t("LABEL_TYPE"),
          constant: "screenshot",
          ui: {
            component: "select",
            support_expression: true,
          },
        },
        {
          name: "fullPage",
          type: "boolean",
          display_name: t("LABEL_FULL_PAGE"),
          ui: {
            component: "switch",
            support_expression: true,
            hint: t("HINT_FULL_PAGE_VIEWPORT"),
          },
        },
        {
          name: "quality",
          type: "number",
          display_name: t("LABEL_QUALITY"),
          default: 100,
          ui: {
            component: "number-input",
            support_expression: true,
            hint: t("HINT_SCREENSHOT_QUALITY"),
          },
        },
        {
          name: "viewport",
          type: "object",
          display_name: t("LABEL_VIEWPORT"),
          properties: [
            {
              name: "width",
              type: "number",
              default: 1280,
              display_name: t("LABEL_VIEWPORT_WIDTH"),
              ui: {
                component: "number-input",
                support_expression: true,
                hint: t("HINT_VIEWPORT_WIDTH"),
              },
            },
            {
              name: "height",
              type: "number",
              default: 800,
              display_name: t("LABEL_VIEWPORT_HEIGHT"),
              ui: {
                component: "number-input",
                support_expression: true,
                hint: t("HINT_VIEWPORT_HEIGHT"),
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
          display_name: t("LABEL_TYPE"),
          constant: "changeTracking",
          ui: {
            component: "select",
            support_expression: true,
          },
        },
        {
          name: "modes",
          type: "array",
          display_name: t("LABEL_MODES"),
          default: ["git-diff"],
          items: {
            name: "mode",
            type: "string",
            enum: ["git-diff", "json"],
          },
          ui: {
            component: "multi-select",
            hint: t("HINT_CHANGE_TRACKING_MODES"),
          },
        },
        {
          name: "prompt",
          type: "string",
          display_name: t("LABEL_PROMPT"),
          ui: {
            component: "textarea",
            support_expression: true,
            hint: t("HINT_CHANGE_TRACKING_PROMPT"),
          },
        },
        {
          name: "tag",
          type: "string",
          display_name: t("LABEL_TAG"),
          ui: {
            component: "input",
            support_expression: true,
            hint: t("HINT_CHANGE_TRACKING_TAG"),
          },
        },
        {
          name: "schema",
          type: "string",
          display_name: t("LABEL_SCHEMA"),
          ui: {
            component: "code-editor",
            support_expression: true,
            language: "json",
            hint: t("HINT_CHANGE_TRACKING_SCHEMA"),
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
          display_name: t("LABEL_TYPE"),
          constant: "json",
        },
        {
          name: "prompt",
          type: "string",
          display_name: t("LABEL_PROMPT"),
          ui: {
            component: "textarea",
            support_expression: true,
            hint: t("HINT_JSON_PROMPT"),
          },
        },
        {
          name: "schema",
          type: "string",
          display_name: t("LABEL_SCHEMA"),
          ui: {
            component: "code-editor",
            support_expression: true,
            language: "json",
            hint: t("HINT_JSON_SCHEMA"),
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
  display_name: t("LABEL_FORMATS"),
  items: formatItemParameter,
  ui: {
    component: "array-section",
    hint: t("HINT_FORMATS"),
  },
}

const headersParameter: PropertyObject<"headers"> = {
  name: "headers",
  type: "object",
  display_name: t("LABEL_HEADERS"),
  properties: [],
  additional_properties: {
    type: "string",
    name: "header-value",
  },
  ui: {
    component: "section",
    hint: t("HINT_HEADERS"),
  },
}

const actionsParameter: PropertyArray = {
  name: "actions",
  type: "array",
  display_name: t("LABEL_ACTIONS"),
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
          display_name: t("LABEL_TYPE"),
          constant: "wait",
          ui: {
            component: "select",
          },
        },
        {
          name: "milliseconds",
          type: "number",
          display_name: t("LABEL_MILLISECONDS"),
          default: 1000,
          ui: {
            component: "number-input",
            support_expression: true,
            hint: t("HINT_WAIT_MILLISECONDS"),
          },
        },
        {
          name: "selector",
          type: "string",
          display_name: t("LABEL_SELECTOR"),
          ui: {
            component: "input",
            support_expression: true,
            hint: t("HINT_WAIT_SELECTOR"),
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
          display_name: t("LABEL_TYPE"),
          constant: "screenshot",
          ui: {
            component: "select",
          },
        },
        {
          name: "fullPage",
          type: "boolean",
          display_name: t("LABEL_FULL_PAGE"),
          ui: {
            component: "switch",
            support_expression: true,
            hint: t("HINT_FULL_PAGE_VIEWPORT"),
          },
        },
        {
          name: "quality",
          type: "number",
          display_name: t("LABEL_QUALITY"),
          default: 100,
          ui: {
            component: "number-input",
            support_expression: true,
            hint: t("HINT_SCREENSHOT_QUALITY"),
          },
        },
        {
          name: "viewport",
          type: "object",
          display_name: t("LABEL_VIEWPORT"),
          properties: [
            {
              name: "width",
              type: "number",
              default: 1280,
              display_name: t("LABEL_VIEWPORT_WIDTH"),
              ui: {
                component: "number-input",
                support_expression: true,
                hint: t("HINT_VIEWPORT_WIDTH"),
              },
            },
            {
              name: "height",
              type: "number",
              default: 800,
              display_name: t("LABEL_VIEWPORT_HEIGHT"),
              ui: {
                component: "number-input",
                support_expression: true,
                hint: t("HINT_VIEWPORT_HEIGHT"),
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
          display_name: t("LABEL_TYPE"),
          constant: "click",
          ui: {
            component: "select",
          },
        },
        {
          name: "selector",
          type: "string",
          display_name: t("LABEL_SELECTOR"),
          required: true,
          ui: {
            component: "input",
            support_expression: true,
            hint: t("HINT_CLICK_SELECTOR"),
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
          display_name: t("LABEL_TYPE"),
          constant: "write",
          ui: {
            component: "select",
          },
        },
        {
          name: "text",
          type: "string",
          display_name: t("LABEL_TEXT"),
          required: true,
          ui: {
            component: "input",
            support_expression: true,
            hint: t("HINT_WRITE_TEXT"),
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
          display_name: t("LABEL_TYPE"),
          constant: "press",
          ui: {
            component: "select",
          },
        },
        {
          name: "key",
          type: "string",
          display_name: t("LABEL_KEY"),
          required: true,
          ui: {
            component: "input",
            support_expression: true,
            hint: t("HINT_PRESS_KEY"),
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
          display_name: t("LABEL_TYPE"),
          constant: "scroll",
          ui: {
            component: "select",
          },
        },
        {
          name: "direction",
          type: "string",
          display_name: t("LABEL_DIRECTION"),
          default: "down",
          enum: ["up", "down"],
          required: true,
          ui: {
            component: "select",
            support_expression: true,
            options: [
              {
                label: t("OPTION_DIRECTION_UP"),
                value: "up",
              },
              {
                label: t("OPTION_DIRECTION_DOWN"),
                value: "down",
              },
            ],
            hint: t("HINT_SCROLL_DIRECTION"),
          },
        },
        {
          name: "selector",
          type: "string",
          display_name: t("LABEL_SELECTOR"),
          ui: {
            component: "input",
            support_expression: true,
            hint: t("HINT_SCROLL_SELECTOR"),
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
          display_name: t("LABEL_TYPE"),
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
          display_name: t("LABEL_TYPE"),
          constant: "executeJavascript",
          ui: {
            component: "select",
          },
        },
        {
          name: "script",
          type: "string",
          display_name: t("LABEL_SCRIPT"),
          required: true,
          ui: {
            component: "code-editor",
            support_expression: true,
            language: "javascript",
            hint: t("HINT_EXECUTE_JAVASCRIPT_SCRIPT"),
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
          display_name: t("LABEL_TYPE"),
          constant: "pdf",
          ui: {
            component: "select",
          },
        },
        {
          name: "format",
          type: "string",
          display_name: t("LABEL_FORMAT"),
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
            hint: t("HINT_PDF_FORMAT"),
          },
        },
        {
          name: "landscape",
          type: "boolean",
          display_name: t("LABEL_LANDSCAPE"),
          ui: {
            component: "switch",
            support_expression: true,
            hint: t("HINT_PDF_LANDSCAPE"),
          },
        },
        {
          name: "scale",
          type: "number",
          display_name: t("LABEL_SCALE"),
          default: 1,
          ui: {
            component: "number-input",
            support_expression: true,
            hint: t("HINT_PDF_SCALE"),
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
      hint: t("HINT_ACTIONS"),
    },
}

const locationParameter: PropertyObject = {
  name: "location",
  type: "object",
  display_name: t("LABEL_LOCATION"),
  properties: [
    {
      // ISO 3166-1 alpha-2 country code
      name: "country",
      type: "string",
      display_name: t("LABEL_COUNTRY"),
      default: "US",
      ui: {
        component: "input",
        support_expression: true,
        hint: t("HINT_LOCATION_COUNTRY"),
      },
    },
    {
      name: "languages",
      type: "array",
      display_name: t("LABEL_LANGUAGES"),
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
    hint: t("HINT_LOCATION_SETTINGS"),
  },
}

const onlyMainContentParameter: PropertyBoolean = {
  name: "onlyMainContent",
  type: "boolean",
  display_name: t("LABEL_ONLY_MAIN_CONTENT"),
  default: true,
  ui: {
    component: "switch",
    support_expression: true,
    hint: t("HINT_ONLY_MAIN_CONTENT"),
  },
}

const removeBase64ImagesParameter: PropertyBoolean = {
  name: "removeBase64Images",
  type: "boolean",
  display_name: t("LABEL_REMOVE_BASE64_IMAGES"),
  default: true,
  ui: {
    component: "switch",
    support_expression: true,
    hint: t("HINT_REMOVE_BASE64_IMAGES"),
  },
}

const timeoutParameter: PropertyNumber = {
  name: "timeout",
  type: "number",
  display_name: t("LABEL_TIMEOUT_MS"),
  ui: {
    component: "number-input",
    support_expression: true,
    hint: t("HINT_TIMEOUT_MS"),
  },
}

const mobileParameter: PropertyBoolean = {
  name: "mobile",
  type: "boolean",
  default: false,
  display_name: t("LABEL_MOBILE"),
  ui: {
    component: "switch",
    support_expression: true,
    hint: t("HINT_MOBILE"),
  },
}

const blockAdsParameter: PropertyBoolean = {
  name: "blockAds",
  type: "boolean",
  default: true,
  display_name: t("LABEL_BLOCK_ADS"),
  ui: {
    component: "switch",
    support_expression: true,
    hint: t("HINT_BLOCK_ADS"),
  },
}

const waitForParameter: PropertyNumber = {
  name: "waitFor",
  type: "number",
  display_name: t("LABEL_WAIT_FOR_MS"),
  ui: {
    component: "number-input",
    support_expression: true,
    hint: t("HINT_WAIT_FOR_MS"),
  },
}

const storeInCacheParameter: PropertyBoolean = {
  name: "storeInCache",
  type: "boolean",
  default: true,
  display_name: t("LABEL_STORE_IN_CACHE"),
  ui: {
    component: "switch",
    support_expression: true,
    hint: t("HINT_STORE_IN_CACHE"),
  },
}

const maxAgeParameter: PropertyNumber = {
  name: "maxAge",
  type: "integer",
  default: 172800000,
  display_name: t("LABEL_MAX_AGE_MS"),
  ui: {
    component: "number-input",
    support_expression: true,
    step: 1,
    hint: t("HINT_MAX_AGE_MS"),
  },
}

const includeTagsParameter: PropertyArray = {
  name: "includeTags",
  type: "array",
  display_name: t("LABEL_INCLUDE_TAGS"),
  items: {
    name: "tag",
    type: "string",
  },
  ui: {
    component: "tag-input",
    support_expression: true,
    hint: t("HINT_INCLUDE_TAGS"),
  },
}

const excludeTagsParameter: PropertyArray = {
  name: "excludeTags",
  type: "array",
  display_name: t("LABEL_EXCLUDE_TAGS"),
  items: {
    name: "tag",
    type: "string",
  },
  ui: {
    component: "tag-input",
    support_expression: true,
    hint: t("HINT_EXCLUDE_TAGS"),
  },
}

const proxyParameter: PropertyString = {
  name: "proxy",
  type: "string",
  display_name: t("LABEL_PROXY"),
  default: "auto",
  enum: ["basic", "stealth", "auto"],
  ui: {
    component: "select",
    support_expression: true,
    hint: t("HINT_PROXY"),
  },
}

const skipTlsVerificationParameter: PropertyBoolean = {
  name: "skipTlsVerification",
  type: "boolean",
  default: true,
  display_name: t("LABEL_SKIP_TLS_VERIFICATION"),
  ui: {
    component: "switch",
    support_expression: true,
    hint: t("HINT_SKIP_TLS_VERIFICATION"),
  },
}

export const scrapeOptionsParameter: PropertyObject<"scrapeOptions"> = {
  name: "scrapeOptions",
  type: "object",
  ui: {
    component: "section",
  },
  display_name: t("LABEL_SCRAPE_OPTIONS"),
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
