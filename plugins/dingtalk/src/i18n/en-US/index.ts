import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "DingTalk",
  PLUGIN_DESCRIPTION:
    "Work with DingTalk users, approvals, documents, and robots.",

  CREDENTIAL_DISPLAY_NAME: "DingTalk App Credential",
  CREDENTIAL_DESCRIPTION:
    "Enterprise internal app credential for DingTalk Open Platform APIs.",
  CREDENTIAL_CORP_ID_DISPLAY_NAME: "Corp ID",
  CREDENTIAL_CORP_ID_HINT:
    "Organization ID where the DingTalk app is installed.",
  CREDENTIAL_CORP_ID_PLACEHOLDER: "dingxxxxxxxxxxxx",
  CREDENTIAL_CLIENT_ID_DISPLAY_NAME: "Client ID",
  CREDENTIAL_CLIENT_ID_HINT:
    "Found in the DingTalk developer console under app credentials.",
  CREDENTIAL_CLIENT_ID_PLACEHOLDER: "dingoa...",
  CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME: "Client Secret",
  CREDENTIAL_CLIENT_SECRET_HINT:
    "Keep this secret secure. It is used to fetch access tokens at runtime.",
  CREDENTIAL_CLIENT_SECRET_PLACEHOLDER: "App secret",
  CREDENTIAL_USER_UNION_ID_DISPLAY_NAME: "Default Operator unionId",
  CREDENTIAL_USER_UNION_ID_HINT:
    "Optional default operator unionId for document and workflow operations. When a workflow tool needs a userId and none is provided, the plugin resolves it from this unionId.",
  CREDENTIAL_USER_UNION_ID_PLACEHOLDER: "unionId",
  CREDENTIAL_AGENT_ID_DISPLAY_NAME: "Default Agent ID",
  CREDENTIAL_AGENT_ID_HINT:
    "Required. Use the AgentId of your internal DingTalk app. See DingTalk Basic Concepts and find it in the developer console for the app.",
  CREDENTIAL_AGENT_ID_PLACEHOLDER: "agentId",

  PARAM_CREDENTIAL_LABEL: "Credential",
  PARAM_OPERATOR_ID_LABEL: "Operator unionId",
  PARAM_OPERATOR_ID_HINT:
    "Optional override. When omitted, the credential's default user_union_id is used.",
  PARAM_OPERATOR_ID_PLACEHOLDER: "unionId of the operator",
  PARAM_OPERATOR_ID_LLM_DESCRIPTION:
    "Operator unionId for the DingTalk request. Optional; when omitted, the credential's default user_union_id is used.",
  PARAM_USER_ID_LABEL: "User ID",
  PARAM_USER_ID_HINT:
    "Optional. Leave blank to resolve userId from the credential's default user_union_id.",
  PARAM_USER_ID_PLACEHOLDER: "user123",
  PARAM_MOBILE_LABEL: "Mobile",
  PARAM_MOBILE_PLACEHOLDER: "13000000000",
  PARAM_QUERY_WORD_LABEL: "Query Word",
  PARAM_QUERY_WORD_HINT: "User name, name pinyin, or English name.",
  PARAM_OFFSET_LABEL: "Offset",
  PARAM_SIZE_LABEL: "Size",
  PARAM_FULL_MATCH_FIELD_LABEL: "Exact Match",
  PARAM_ROBOT_CODE_LABEL: "Robot Code",
  PARAM_USER_IDS_LABEL: "User IDs",
  PARAM_USER_IDS_HINT: "Up to 20 userIds per request.",
  PARAM_MESSAGE_TYPE_LABEL: "Message Type",
  PARAM_MESSAGE_JSON_LABEL: "Message JSON",
  PARAM_MESSAGE_JSON_HINT:
    "Use a JSON object matching the selected message type. For text, provide a content field. For markdown, provide title and text fields.",
  PARAM_REMIND_TYPE_LABEL: "Remind Type",
  PARAM_RECEIVER_USER_ID_LIST_LABEL: "Receiver User IDs",
  PARAM_CONTENT_LABEL: "Content",
  PARAM_CALL_VOICE_LABEL: "Call Voice",
  PARAM_OPEN_DING_ID_LABEL: "Open DING ID",
  PARAM_DOWNLOAD_CODE_LABEL: "Download Code",
  PARAM_PROCESS_INSTANCE_ID_LABEL: "Process Instance ID",
  PARAM_TASK_ID_LABEL: "Task ID",
  PARAM_ACTIONER_USER_ID_LABEL: "Actioner User ID",
  PARAM_ACTIONER_USER_ID_HINT:
    "Optional. Leave blank to resolve actionerUserId from the credential's default user_union_id.",
  PARAM_ACTION_RESULT_LABEL: "Result",
  PARAM_ACTION_RESULT_HINT:
    "Use agree to approve the current task or refuse to reject it. DingTalk requires tasks to be executed in approval-node order.",
  PARAM_TEXT_LABEL: "Text",
  PARAM_COMMENT_USER_ID_LABEL: "Comment User ID",
  PARAM_COMMENT_USER_ID_HINT:
    "Optional. Leave blank to resolve commentUserId from the credential's default user_union_id.",
  PARAM_FILE_JSON_LABEL: "File JSON",
  WORKFLOW_DOWNLOAD_ATTACHMENT_FILE_ID_HINT:
    "Use the fileId from a workflow form component. Comment attachment fileIds are not supported for download links yet.",
  PARAM_FILE_ID_LABEL: "File ID",
  PARAM_WITH_COMMENT_ATTACHMENT_LABEL: "Include Comment Attachment",
  PARAM_PROCESS_CODE_LABEL: "Process Code",
  PARAM_START_TIME_LABEL: "Start Time",
  PARAM_START_TIME_HINT:
    "Required. Supports Unix ms timestamps and absolute date/time formats such as 2026-04-15, 2026-04-15 14:30, 2026/04/15 14:30:00, 2026-04-15T14:30:00+08:00, April 15, 2026 2:30 PM, and 2026年4月15日 14:30. Date-only values use the start of that day.",
  PARAM_START_TIME_PLACEHOLDER:
    "e.g. 2026-04-15 14:30 or April 15, 2026 2:30 PM",
  PARAM_END_TIME_LABEL: "End Time",
  PARAM_END_TIME_HINT:
    "Optional. Supports the same absolute formats as Start Time. Date-only values use the end of that day.",
  PARAM_END_TIME_PLACEHOLDER:
    "e.g. 2026-04-15, 2026/04/15 14:30:00, or 2026年4月15日 14:30",
  PARAM_STARTER_USER_IDS_LABEL: "Starter User IDs",
  PARAM_STATUSES_LABEL: "Statuses",
  PARAM_MAX_RESULTS_LABEL: "Page Size",
  PARAM_NEXT_TOKEN_LABEL: "Next Token",
  PARAM_AGENT_ID_LABEL: "Agent ID",
  PARAM_OP_USER_ID_LABEL: "Operator User ID",
  PARAM_VARIABLES_JSON_LABEL: "Variables JSON",
  PARAM_VARIABLES_JSON_HINT:
    "Provide a JSON array of variable objects. Each item should include an id and value, and can also include bizAlias or extValue.",
  PARAM_REMARK_LABEL: "Remark",
  PARAM_VISIBILITY_LABEL: "Visibility",
  PARAM_SELECT_FIELDS_LABEL: "Select Fields",
  PARAM_SELECT_FIELDS_PLACEHOLDER: "values,formulas",
  PARAM_DOC_ID_LABEL: "Doc ID",
  PARAM_RESOURCE_SIZE_LABEL: "Size",
  PARAM_MEDIA_TYPE_LABEL: "Media Type",
  PARAM_MEDIA_TYPE_PLACEHOLDER: "image/jpeg",
  PARAM_RESOURCE_NAME_LABEL: "Resource Name",
  PARAM_FILE_LABEL: "File",

  OPTION_MESSAGE_TYPE_TEXT: "Text",
  OPTION_MESSAGE_TYPE_LINK: "Link",
  OPTION_MESSAGE_TYPE_MARKDOWN: "Markdown",
  OPTION_MESSAGE_TYPE_ACTION_CARD: "Action Card",
  OPTION_MESSAGE_TYPE_FEED_CARD: "Feed Card",
  OPTION_REMIND_TYPE_IN_APP: "In-app DING",
  OPTION_REMIND_TYPE_SMS: "SMS DING",
  OPTION_REMIND_TYPE_PHONE: "Phone DING",
  OPTION_STATUS_RUNNING: "Running",
  OPTION_STATUS_TERMINATED: "Terminated",
  OPTION_STATUS_COMPLETED: "Completed",
  OPTION_STATUS_COMPLETED_WITH_BLANKS: "Completed With Blanks",
  OPTION_ACTION_RESULT_AGREE: "Approve",
  OPTION_ACTION_RESULT_REFUSE: "Reject",
  OPTION_VISIBILITY_VISIBLE: "Visible",
  OPTION_VISIBILITY_HIDDEN: "Hidden",

  AUTH_TOOL_DISPLAY_NAME: "Get App Access Token",
  AUTH_TOOL_DESCRIPTION:
    "Fetch the current DingTalk app access token using the selected credential.",

  USER_GET_TOOL_DISPLAY_NAME: "Get User",
  USER_GET_TOOL_DESCRIPTION: "Get user details by userId.",
  USER_GET_BY_MOBILE_TOOL_DISPLAY_NAME: "Get User By Mobile",
  USER_GET_BY_MOBILE_TOOL_DESCRIPTION: "Look up a userId by mobile number.",
  USER_SEARCH_TOOL_DISPLAY_NAME: "Search Users",
  USER_SEARCH_TOOL_DESCRIPTION:
    "Search users by name, pinyin, or English name.",

  ROBOT_BATCH_SEND_TOOL_DISPLAY_NAME: "Batch Send Robot Message",
  ROBOT_BATCH_SEND_TOOL_DESCRIPTION: "Send one-to-one robot messages in batch.",
  ROBOT_SEND_DING_TOOL_DISPLAY_NAME: "Send DING Message",
  ROBOT_SEND_DING_TOOL_DESCRIPTION:
    "Send a DING message through an enterprise robot.",
  ROBOT_RECALL_DING_TOOL_DISPLAY_NAME: "Recall DING Message",
  ROBOT_RECALL_DING_TOOL_DESCRIPTION: "Recall a previously sent DING message.",
  ROBOT_DOWNLOAD_FILE_TOOL_DISPLAY_NAME: "Download Robot Message File",
  ROBOT_DOWNLOAD_FILE_TOOL_DESCRIPTION:
    "Download a file received by a DingTalk robot and return it as file_ref.",

  WORKFLOW_GET_INSTANCE_TOOL_DISPLAY_NAME: "Get Process Instance",
  WORKFLOW_GET_INSTANCE_TOOL_DESCRIPTION:
    "Get details for a workflow process instance.",
  WORKFLOW_ADD_COMMENT_TOOL_DISPLAY_NAME: "Add Process Comment",
  WORKFLOW_ADD_COMMENT_TOOL_DESCRIPTION: "Add a comment to a process instance.",
  WORKFLOW_EXECUTE_TASK_TOOL_DISPLAY_NAME: "Execute Process Task",
  WORKFLOW_EXECUTE_TASK_TOOL_DESCRIPTION:
    "Approve or reject a single workflow task. DingTalk documents this capability for internal apps and requires task execution in approval-node order.",
  WORKFLOW_DOWNLOAD_ATTACHMENT_TOOL_DISPLAY_NAME: "Download Process Attachment",
  WORKFLOW_DOWNLOAD_ATTACHMENT_TOOL_DESCRIPTION:
    "Get download authorization information for a process attachment.",
  WORKFLOW_LIST_INSTANCE_IDS_TOOL_DISPLAY_NAME: "List Process Instance IDs",
  WORKFLOW_LIST_INSTANCE_IDS_TOOL_DESCRIPTION:
    "List workflow process instance IDs by process code and filters.",
  WORKFLOW_GET_SPACE_INFO_TOOL_DISPLAY_NAME: "Get Process Space Info",
  WORKFLOW_GET_SPACE_INFO_TOOL_DESCRIPTION:
    "Get DingDrive space information used for workflow attachments.",
  WORKFLOW_UPDATE_INSTANCE_TOOL_DISPLAY_NAME: "Update Process Instance",
  WORKFLOW_UPDATE_INSTANCE_TOOL_DESCRIPTION:
    "Update a workflow process instance with variables and remark.",
  WORKFLOW_LIST_VISIBLE_TEMPLATES_TOOL_DISPLAY_NAME: "List Visible Templates",
  WORKFLOW_LIST_VISIBLE_TEMPLATES_TOOL_DESCRIPTION:
    "List workflow templates visible to a user.",

  DOC_GET_UPLOAD_INFO_TOOL_DISPLAY_NAME: "Get Doc Upload Info",
  DOC_GET_UPLOAD_INFO_TOOL_DESCRIPTION:
    "Get upload information for a DingTalk doc resource.",
  DOC_UPLOAD_ATTACHMENT_TOOL_DISPLAY_NAME: "Upload Doc Attachment",
  DOC_UPLOAD_ATTACHMENT_TOOL_DESCRIPTION:
    "Upload a file_ref to a DingTalk doc resource.",

  USER_GET_USER_ID_LLM_DESCRIPTION: "DingTalk user ID to retrieve.",
  USER_GET_BY_MOBILE_MOBILE_LLM_DESCRIPTION:
    "Mobile phone number of the DingTalk user to look up.",
  USER_SEARCH_QUERY_WORD_LLM_DESCRIPTION:
    "Keyword to search DingTalk users by name, pinyin, or English name.",
  USER_SEARCH_OFFSET_LLM_DESCRIPTION:
    "Pagination offset for the user search, starting from 0.",
  USER_SEARCH_SIZE_LLM_DESCRIPTION:
    "Number of users to return in this search request.",
  USER_SEARCH_FULL_MATCH_FIELD_LLM_DESCRIPTION:
    "Whether the search should require an exact match on supported fields.",
  ROBOT_BATCH_SEND_ROBOT_CODE_LLM_DESCRIPTION:
    "DingTalk robot code used to send the batch robot message.",
  ROBOT_BATCH_SEND_MESSAGE_TYPE_LLM_DESCRIPTION:
    "Robot message type. Supported values include text, link, markdown, actionCard, and feedCard.",
  ROBOT_BATCH_SEND_MESSAGE_JSON_LLM_DESCRIPTION:
    "JSON object for the selected robot message type. For text use content; for markdown use title and text.",
  ROBOT_SEND_DING_ROBOT_CODE_LLM_DESCRIPTION:
    "DingTalk robot code used to send the DING message.",
  ROBOT_SEND_DING_REMIND_TYPE_LLM_DESCRIPTION:
    "Reminder type for the DING message: 1 for in-app, 2 for SMS, 3 for phone call.",
  ROBOT_SEND_DING_CONTENT_LLM_DESCRIPTION:
    "Text content to send in the DING message.",
  ROBOT_SEND_DING_CALL_VOICE_LLM_DESCRIPTION:
    "Voice preset to use when remind_type is 3 and DingTalk places a phone call.",
  ROBOT_RECALL_DING_ROBOT_CODE_LLM_DESCRIPTION:
    "DingTalk robot code that sent the DING message.",
  ROBOT_RECALL_DING_OPEN_DING_ID_LLM_DESCRIPTION:
    "Open DING ID of the message to recall.",
  ROBOT_DOWNLOAD_FILE_ROBOT_CODE_LLM_DESCRIPTION:
    "DingTalk robot code used to access the robot message file.",
  ROBOT_DOWNLOAD_FILE_DOWNLOAD_CODE_LLM_DESCRIPTION:
    "Download code returned by DingTalk for the robot message file to retrieve.",
  WORKFLOW_GET_INSTANCE_PROCESS_INSTANCE_ID_LLM_DESCRIPTION:
    "Workflow process instance ID to retrieve.",
  WORKFLOW_ADD_COMMENT_PROCESS_INSTANCE_ID_LLM_DESCRIPTION:
    "Workflow process instance ID to comment on.",
  WORKFLOW_ADD_COMMENT_TEXT_LLM_DESCRIPTION:
    "Optional text body of the workflow comment.",
  WORKFLOW_ADD_COMMENT_COMMENT_USER_ID_LLM_DESCRIPTION:
    "Optional commenter userId in DingTalk. If omitted, the plugin resolves it from the credential's default user_union_id.",
  WORKFLOW_ADD_COMMENT_FILE_LLM_DESCRIPTION:
    "Optional image file to include in the workflow comment. Provide a file_ref; the plugin will send it as file.photos after resolving a remote URL.",
  WORKFLOW_ADD_COMMENT_FILE_HINT:
    "Optional. Select an image file to attach to the workflow comment.",
  WORKFLOW_ADD_COMMENT_FILE_JSON_LLM_DESCRIPTION:
    "Optional JSON object describing workflow comment photos and/or attachments.",
  WORKFLOW_EXECUTE_TASK_PROCESS_INSTANCE_ID_LLM_DESCRIPTION:
    "Workflow process instance ID that owns the task to execute.",
  WORKFLOW_EXECUTE_TASK_TASK_ID_LLM_DESCRIPTION:
    "Task node ID of the workflow task to approve or reject.",
  WORKFLOW_EXECUTE_TASK_ACTIONER_USER_ID_LLM_DESCRIPTION:
    "Optional DingTalk user ID of the actor executing the workflow task. This maps to actionerUserId in the API. If omitted, the plugin resolves it from the credential's default user_union_id.",
  WORKFLOW_EXECUTE_TASK_RESULT_LLM_DESCRIPTION:
    "Execution result for the workflow task: use agree to approve or refuse to reject.",
  WORKFLOW_EXECUTE_TASK_REMARK_LLM_DESCRIPTION:
    "Optional remark to include with the approval or rejection.",
  WORKFLOW_EXECUTE_TASK_FILE_LLM_DESCRIPTION:
    "Optional image file to include while executing the workflow task. Provide a file_ref; the plugin will send it as file.photos after resolving a remote URL.",
  WORKFLOW_EXECUTE_TASK_FILE_HINT:
    "Optional. Select an image file to send with the task execution.",
  WORKFLOW_EXECUTE_TASK_FILE_JSON_LLM_DESCRIPTION:
    "Optional JSON object describing photos and/or attachments to send with the task execution.",
  WORKFLOW_EXECUTE_TASK_REMARK_HINT:
    "Optional. Useful for approval comments or rejection reasons. DingTalk documents this task-execution API for internal apps.",
  WORKFLOW_DOWNLOAD_ATTACHMENT_PROCESS_INSTANCE_ID_LLM_DESCRIPTION:
    "Workflow process instance ID that owns the attachment.",
  WORKFLOW_DOWNLOAD_ATTACHMENT_FILE_ID_LLM_DESCRIPTION:
    "The fileId uploaded in a workflow form component. Comment attachment fileIds are not supported for download links yet.",
  WORKFLOW_DOWNLOAD_ATTACHMENT_WITH_COMMENT_ATTACHMENT_LLM_DESCRIPTION:
    "Whether the file_id refers to a comment attachment instead of a form attachment.",
  WORKFLOW_LIST_INSTANCE_IDS_PROCESS_CODE_LLM_DESCRIPTION:
    "Workflow process code whose instance IDs should be listed.",
  WORKFLOW_LIST_INSTANCE_IDS_START_TIME_LLM_DESCRIPTION:
    "Required start time for filtering process instances. Supports Unix millisecond timestamps and absolute EN/ZH date-time formats such as 2026-04-15, 2026-04-15 14:30, 2026/04/15 14:30:00, 2026-04-15T14:30:00+08:00, April 15, 2026 2:30 PM, and 2026年4月15日 14:30. Date-only values resolve to the start of that day in the runtime local timezone.",
  WORKFLOW_LIST_INSTANCE_IDS_END_TIME_LLM_DESCRIPTION:
    "Optional end time for filtering process instances. Supports the same absolute EN/ZH date-time formats as start_time. Date-only values resolve to the end of that day in the runtime local timezone. Reject ambiguous numeric dates like 04/05/2026.",
  WORKFLOW_LIST_INSTANCE_IDS_MAX_RESULTS_LLM_DESCRIPTION:
    "Maximum number of process instance IDs to return per page.",
  WORKFLOW_LIST_INSTANCE_IDS_NEXT_TOKEN_LLM_DESCRIPTION:
    "Pagination token for the next page of process instance IDs.",
  WORKFLOW_GET_SPACE_INFO_USER_ID_LLM_DESCRIPTION:
    "Optional DingTalk user ID used to query workflow attachment space info. If omitted, the plugin resolves it from the credential's default user_union_id.",
  WORKFLOW_GET_SPACE_INFO_AGENT_ID_LLM_DESCRIPTION:
    "Optional agent ID for the DingTalk app whose workflow space info is needed.",
  WORKFLOW_UPDATE_INSTANCE_OP_USER_ID_LLM_DESCRIPTION:
    "User ID of the operator performing the workflow process instance update.",
  WORKFLOW_UPDATE_INSTANCE_PROCESS_CODE_LLM_DESCRIPTION:
    "Optional workflow process code for the instance being updated.",
  WORKFLOW_UPDATE_INSTANCE_PROCESS_INSTANCE_ID_LLM_DESCRIPTION:
    "Workflow process instance ID to update.",
  WORKFLOW_UPDATE_INSTANCE_VARIABLES_JSON_LLM_DESCRIPTION:
    "JSON array of workflow variable objects. Each item must include id and value, and may include bizAlias or extValue.",
  WORKFLOW_UPDATE_INSTANCE_REMARK_LLM_DESCRIPTION:
    "Optional remark text to save with the workflow update.",
  WORKFLOW_LIST_VISIBLE_TEMPLATES_USER_ID_LLM_DESCRIPTION:
    "Optional DingTalk user ID whose visible workflow templates should be listed. If omitted, the plugin resolves it from the credential's default user_union_id.",
  WORKFLOW_LIST_VISIBLE_TEMPLATES_MAX_RESULTS_LLM_DESCRIPTION:
    "Maximum number of templates to return per page.",
  WORKFLOW_LIST_VISIBLE_TEMPLATES_NEXT_TOKEN_LLM_DESCRIPTION:
    "Pagination token for the next page of visible templates.",
} satisfies BaseTranslation

export default en_US
