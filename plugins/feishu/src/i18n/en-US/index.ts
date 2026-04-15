import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Feishu Plugin",
  PLUGIN_DESCRIPTION:
    "Connect Feishu OpenAPI for contacts, chats, calendars, tasks, and approvals.",
  DEMO_TOOL_DISPLAY_NAME: "Demo Tool",
  DEMO_TOOL_DESCRIPTION: "A tool for testing the plugin",
  LOCATION_DISPLAY_NAME: "Location",
  LOCATION_HINT: "The location to test",
  LOCATION_PLACEHOLDER: "Enter the location to test",
  CREDENTIAL: "Credential",
  QUERY_PARAMS: "Query Params",
  BODY: "Body",
  QUERY_PARAMS_HINT: "HTTP query object as JSON string (optional)",
  BODY_HINT: "HTTP body object as JSON string (optional)",
  DEPARTMENT_ID: "department_id",
  DEPARTMENT_ID_HINT: "URL path parameter: department_id",
  USER_ID: "user_id",
  USER_ID_HINT: "URL path parameter: user_id",
  CHAT_ID: "chat_id",
  CHAT_ID_HINT: "URL path parameter: chat_id",
  IMAGE_KEY: "image_key",
  IMAGE_KEY_HINT: "URL path parameter: image_key",
  FILE_KEY: "file_key",
  FILE_KEY_HINT: "URL path parameter: file_key",
  CALENDAR_ID: "calendar_id",
  CALENDAR_ID_HINT: "URL path parameter: calendar_id",
  EVENT_ID: "event_id",
  EVENT_ID_HINT: "URL path parameter: event_id",
  ATTENDEE_ID: "attendee_id",
  ATTENDEE_ID_HINT: "URL path parameter: attendee_id",
  TIMEOFF_EVENT_ID: "timeoff_event_id",
  TIMEOFF_EVENT_ID_HINT: "URL path parameter: timeoff_event_id",
  TASK_GUID: "task_guid",
  TASK_GUID_HINT: "URL path parameter: task_guid",
  MEMBER_ID: "member_id",
  MEMBER_ID_HINT: "URL path parameter: member_id",
  INSTANCE_ID: "instance_id",
  INSTANCE_ID_HINT: "URL path parameter: instance_id",
  PAGE_SIZE: "Page Size",
  PAGE_TOKEN: "Page Token",
  PAGE_TOKEN_HINT: "Pagination token for next page",
  IM_IMAGE_FILE_DISPLAY_NAME: "Image file",
  IM_IMAGE_FILE_HINT:
    "Image to upload (JPEG, PNG, WEBP, GIF, TIFF, BMP, ICO). Use a file_ref from an upstream step or file picker.",
  IM_IMAGE_FILE_AI_DESCRIPTION:
    "A workflow file_ref pointing to the image bytes to upload to Feishu.",
  IM_IMAGE_TYPE_DISPLAY_NAME: "image_type",
  IM_IMAGE_TYPE_HINT:
    "message: for chat images (default). avatar: for profile avatars.",
  IM_FILE_REF_DISPLAY_NAME: "File",
  IM_FILE_REF_HINT:
    "File to upload. Use a file_ref from an upstream step or file picker (same pattern as upload image).",
  IM_FILE_REF_AI_DESCRIPTION:
    "A workflow file_ref pointing to the file bytes to upload to Feishu IM.",
  IM_FILE_TYPE_PARAM_DISPLAY_NAME: "file_type",
  IM_FILE_TYPE_PARAM_HINT:
    "Feishu file type: opus | mp4 | pdf | doc | xls | ppt | stream (default stream).",
  IM_FILE_NAME_PARAM_DISPLAY_NAME: "file_name",
  IM_FILE_NAME_PARAM_HINT:
    "Optional display name in Feishu. Defaults to the file_ref filename when omitted.",
} satisfies BaseTranslation

export default en_US
