import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { calendar_v3 } from "googleapis"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam, calendarIdParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import {
  optionalIanaTimezoneSchema,
  optionalRfc3339Schema,
  parseTimeRange,
} from "../../lib/validators"

function splitToArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === "") return undefined
  const s = String(value).trim()
  if (!s) return undefined
  const parts = s
    .split(/[,\n]+/)
    .map((x) => x.trim())
    .filter(Boolean)
  return parts.length ? parts : undefined
}

const EVENT_TYPE_VALUES = [
  "birthday",
  "default",
  "focusTime",
  "fromGmail",
  "outOfOffice",
  "workingLocation",
] as const

export const listEventsTool: ToolDefinition = {
  name: "list-events",
  display_name: t("LIST_EVENTS_DISPLAY_NAME"),
  description: t("LIST_EVENTS_DESCRIPTION"),
  icon: "📋",
  parameters: [
    calendarCredentialParam,
    calendarIdParam,
    {
      name: "max_results",
      type: "integer",
      required: false,
      display_name: t("MAX_RESULTS_DISPLAY_NAME"),
      default: 250,
      minimum: 1,
      maximum: 2500,
      ai: {
        llm_description: {
          en_US:
            "maxResults: max events per page (default 250, max 2500). See nextPageToken for pagination.",
          zh_Hans:
            "maxResults：单页最大事件数（默认 250，最大 2500）。分页使用响应中的 nextPageToken。",
        },
      },
      ui: {
        component: "number-input",
        support_expression: true,
        hint: t("MAX_RESULTS_HINT"),
      },
    },
    {
      name: "page_token",
      type: "string",
      required: false,
      display_name: t("PAGE_TOKEN_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "pageToken from a previous response’s nextPageToken to fetch the next page.",
          zh_Hans: "上一页响应中 nextPageToken 的值，用于请求下一页。",
        },
      },
      ui: {
        component: "input",
        hint: t("PAGE_TOKEN_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "sync_token",
      type: "string",
      required: false,
      display_name: t("SYNC_TOKEN_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "syncToken from a prior list response’s nextSyncToken for incremental sync. Cannot be combined with time_min, time_max, updated_min, q, i_cal_uid, order_by, or extended-property filters.",
          zh_Hans:
            "增量同步：使用上次列表结果最后一页的 nextSyncToken。不可与 time_min、time_max、updated_min、q、i_cal_uid、order_by 及扩展属性筛选同时使用。",
        },
      },
      ui: {
        component: "input",
        hint: t("SYNC_TOKEN_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "time_min",
      type: "string",
      required: false,
      display_name: t("TIME_MIN_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "timeMin: lower bound (exclusive) for an event’s end time. RFC3339 with offset. Examples: 2025-03-01T00:00:00Z, 2025-03-01T08:00:00+08:00.",
          zh_Hans:
            "timeMin：事件结束时间的下限（不含）。RFC3339 须含时区偏移。示例：2025-03-01T00:00:00Z、2025-03-01T08:00:00+08:00。",
        },
      },
      ui: {
        component: "input",
        hint: t("TIME_MIN_HINT"),
        support_expression: true,
      },
    },
    {
      name: "time_max",
      type: "string",
      required: false,
      display_name: t("TIME_MAX_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "timeMax: upper bound (exclusive) for an event’s start time. RFC3339; must be > timeMin if both set. Examples: 2025-03-31T23:59:59Z, 2025-04-01T00:00:00+08:00.",
          zh_Hans:
            "timeMax：事件开始时间的上限（不含）。RFC3339；与 timeMin 同时设置时必须更晚。示例：2025-03-31T23:59:59Z、2025-04-01T00:00:00+08:00。",
        },
      },
      ui: {
        component: "input",
        hint: t("TIME_MAX_HINT"),
        support_expression: true,
      },
    },
    {
      name: "time_zone",
      type: "string",
      required: false,
      display_name: t("LIST_TIME_ZONE_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "timeZone: IANA id for times in the response (default: calendar’s zone). Examples: Asia/Shanghai, Europe/Berlin, Etc/UTC.",
          zh_Hans:
            "timeZone：响应时间的 IANA 时区（默认取日历时区）。示例：Asia/Shanghai、Europe/Berlin、Etc/UTC。",
        },
      },
      ui: {
        component: "input",
        hint: t("LIST_TIME_ZONE_HINT"),
        placeholder: t("TIMEZONE_PLACEHOLDER"),
        support_expression: true,
      },
    },
    {
      name: "q",
      type: "string",
      required: false,
      display_name: t("SEARCH_QUERY_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "q: free-text search over summary, description, location, attendees, organizer, working-location fields, etc.",
          zh_Hans:
            "q：自由文本搜索，匹配标题、描述、地点、参与者、组织者、工作地点相关字段等。",
        },
      },
      ui: {
        component: "input",
        hint: t("SEARCH_QUERY_HINT"),
        placeholder: t("SEARCH_QUERY_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "i_cal_uid",
      type: "string",
      required: false,
      display_name: t("ICAL_UID_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US: "iCalUID: filter by iCalendar event UID.",
          zh_Hans: "iCalUID：按 iCalendar 活动 ID 筛选。",
        },
      },
      ui: {
        component: "input",
        hint: t("ICAL_UID_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "single_events",
      type: "boolean",
      required: false,
      display_name: t("SINGLE_EVENTS_DISPLAY_NAME"),
      default: false,
      ai: {
        llm_description: {
          en_US:
            "singleEvents: if true, expand recurring events into instances (API default is false). Required for orderBy=startTime.",
          zh_Hans:
            "singleEvents：为 true 时展开重复事件为实例（API 默认为 false）。orderBy=startTime 时必须为 true。",
        },
      },
      ui: {
        component: "switch",
        hint: t("SINGLE_EVENTS_HINT"),
        support_expression: true,
      },
    },
    {
      name: "order_by",
      type: "string",
      required: false,
      display_name: t("ORDER_BY_DISPLAY_NAME"),
      enum: ["startTime", "updated"],
      ai: {
        llm_description: {
          en_US:
            "orderBy: startTime (ascending; only when singleEvents=true) or updated (ascending by last modification). Omit for API default stable order.",
          zh_Hans:
            "orderBy：startTime（升序，仅当 singleEvents=true）或 updated（按最后修改时间升序）。不填则使用 API 默认稳定顺序。",
        },
      },
      ui: {
        component: "select",
        hint: t("ORDER_BY_HINT"),
        options: [
          { label: t("ORDER_BY_START_TIME"), value: "startTime" },
          { label: t("ORDER_BY_UPDATED"), value: "updated" },
        ],
        support_expression: true,
      },
    },
    {
      name: "event_types",
      type: "string",
      required: false,
      display_name: t("EVENT_TYPES_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US: `eventTypes: comma-separated event types — ${EVENT_TYPE_VALUES.join(", ")}.`,
          zh_Hans: `eventTypes：逗号分隔，可选值：${EVENT_TYPE_VALUES.join("、")}。`,
        },
      },
      ui: {
        component: "input",
        hint: t("EVENT_TYPES_HINT"),
        placeholder: t("EVENT_TYPES_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "private_extended_properties",
      type: "string",
      required: false,
      display_name: t("PRIVATE_EXTENDED_PROPERTY_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "privateExtendedProperty: comma-separated constraints as propertyName=value (matches private extended properties only).",
          zh_Hans:
            "privateExtendedProperty：逗号分隔的 propertyName=value，仅匹配私有扩展属性。",
        },
      },
      ui: {
        component: "input",
        hint: t("PRIVATE_EXTENDED_PROPERTY_HINT"),
        placeholder: t("PRIVATE_EXTENDED_PROPERTY_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "shared_extended_properties",
      type: "string",
      required: false,
      display_name: t("SHARED_EXTENDED_PROPERTY_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "sharedExtendedProperty: comma-separated propertyName=value (shared extended properties only).",
          zh_Hans:
            "sharedExtendedProperty：逗号分隔的 propertyName=value，仅匹配共享扩展属性。",
        },
      },
      ui: {
        component: "input",
        hint: t("SHARED_EXTENDED_PROPERTY_HINT"),
        placeholder: t("SHARED_EXTENDED_PROPERTY_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "show_deleted",
      type: "boolean",
      required: false,
      display_name: t("SHOW_DELETED_DISPLAY_NAME"),
      default: false,
      ai: {
        llm_description: {
          en_US:
            'showDeleted: include cancelled events (status "cancelled"). Default false.',
          zh_Hans:
            'showDeleted：是否包含已取消事件（status 为 "cancelled"）。默认 false。',
        },
      },
      ui: {
        component: "switch",
        hint: t("SHOW_DELETED_HINT"),
        support_expression: true,
      },
    },
    {
      name: "show_hidden_invitations",
      type: "boolean",
      required: false,
      display_name: t("SHOW_HIDDEN_INVITATIONS_DISPLAY_NAME"),
      default: false,
      ai: {
        llm_description: {
          en_US:
            "showHiddenInvitations: include hidden invitations. Default false.",
          zh_Hans: "showHiddenInvitations：是否包含隐藏邀请。默认 false。",
        },
      },
      ui: {
        component: "switch",
        hint: t("SHOW_HIDDEN_INVITATIONS_HINT"),
        support_expression: true,
      },
    },
    {
      name: "updated_min",
      type: "string",
      required: false,
      display_name: t("UPDATED_MIN_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "updatedMin: RFC3339 lower bound on last modification time; deletes since then are always included. Examples: 2025-03-01T00:00:00Z, 2025-03-01T09:00:00+09:00.",
          zh_Hans:
            "updatedMin：最后修改时间的 RFC3339 下限；此后删除的条目始终包含。示例：2025-03-01T00:00:00Z、2025-03-01T09:00:00+09:00。",
        },
      },
      ui: {
        component: "input",
        hint: t("UPDATED_MIN_HINT"),
        support_expression: true,
      },
    },
    {
      name: "max_attendees",
      type: "integer",
      required: false,
      display_name: t("LIST_MAX_ATTENDEES_DISPLAY_NAME"),
      minimum: 1,
      ai: {
        llm_description: {
          en_US:
            "maxAttendees: max attendees per event in the response; if exceeded, only the participant may be returned.",
          zh_Hans:
            "maxAttendees：每个事件在响应中最多返回的参与者数；超过时可能仅返回参与者。",
        },
      },
      ui: {
        component: "number-input",
        hint: t("LIST_MAX_ATTENDEES_HINT"),
        support_expression: true,
      },
    },
    {
      name: "fields",
      type: "string",
      required: false,
      display_name: t("FIELDS_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "fields: partial response mask (Google Common Parameters), e.g. items(id,summary,start) or *.",
          zh_Hans:
            "fields：部分响应字段掩码（Google 通用参数），例如 items(id,summary,start) 或 *。",
        },
      },
      ui: {
        component: "input",
        hint: t("FIELDS_HINT"),
        placeholder: t("FIELDS_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const calendar = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const {
      calendar_id,
      q,
      time_min,
      time_max,
      max_results,
      page_token,
      sync_token,
      single_events,
      order_by,
      show_deleted,
      time_zone,
      i_cal_uid,
      max_attendees,
      fields,
      show_hidden_invitations,
      updated_min,
      event_types,
      private_extended_properties,
      shared_extended_properties,
    } = args.parameters

    const tz = optionalIanaTimezoneSchema.parse(time_zone)
    const syncTokenStr =
      typeof sync_token === "string" && sync_token.trim()
        ? sync_token.trim()
        : undefined
    const pageTokenStr =
      typeof page_token === "string" && page_token.trim()
        ? page_token.trim()
        : undefined

    const maxResults =
      typeof max_results === "number" && max_results >= 1 && max_results <= 2500
        ? max_results
        : 250

    let listParams: calendar_v3.Params$Resource$Events$List

    if (syncTokenStr) {
      listParams = {
        calendarId: calendar_id as string,
        syncToken: syncTokenStr,
        maxResults,
        pageToken: pageTokenStr,
        fields: (fields as string) || undefined,
        timeZone: tz,
        showDeleted: show_deleted === true ? true : undefined,
        singleEvents:
          single_events === true
            ? true
            : single_events === false
              ? false
              : undefined,
        maxAttendees:
          typeof max_attendees === "number" && max_attendees >= 1
            ? max_attendees
            : undefined,
        eventTypes: splitToArray(event_types),
      }
    } else {
      const { timeMin, timeMax } = parseTimeRange(time_min, time_max)
      const updatedMinParsed = optionalRfc3339Schema.parse(updated_min)
      const singleEvents = single_events === true

      const ob = order_by as string | undefined
      const orderByValue =
        ob === "startTime" || ob === "updated" ? ob : undefined

      listParams = {
        calendarId: calendar_id as string,
        maxResults,
        pageToken: pageTokenStr,
        q: (q as string) || undefined,
        timeMin,
        timeMax,
        timeZone: tz,
        iCalUID: (i_cal_uid as string) || undefined,
        singleEvents,
        orderBy: orderByValue,
        showDeleted: show_deleted === true ? true : undefined,
        showHiddenInvitations:
          show_hidden_invitations === true ? true : undefined,
        updatedMin: updatedMinParsed,
        maxAttendees:
          typeof max_attendees === "number" && max_attendees >= 1
            ? max_attendees
            : undefined,
        fields: (fields as string) || undefined,
        eventTypes: splitToArray(event_types),
        privateExtendedProperty: splitToArray(private_extended_properties),
        sharedExtendedProperty: splitToArray(shared_extended_properties),
      }
    }

    const res = await calendar.events.list(listParams)
    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
