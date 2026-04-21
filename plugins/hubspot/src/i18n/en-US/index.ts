import type { BaseTranslation } from "../i18n-types"

const en_US = {
  // ── Plugin ──────────────────────────────────────────────────────
  PLUGIN_DISPLAY_NAME: "HubSpot",
  PLUGIN_DESCRIPTION:
    "Integrate with HubSpot CRM — manage contacts, companies, deals, tickets, and more.",

  // ── Credentials ─────────────────────────────────────────────────
  CREDENTIAL_TOKEN_DISPLAY_NAME: "HubSpot Private App Token",
  CREDENTIAL_TOKEN_DESCRIPTION:
    "Authenticate with a HubSpot Private App access token.",
  CREDENTIAL_TOKEN_ACCESS_TOKEN_LABEL: "Access Token",
  CREDENTIAL_TOKEN_ACCESS_TOKEN_HINT:
    "The access token from your HubSpot Private App settings.",
  CREDENTIAL_TOKEN_ACCESS_TOKEN_PLACEHOLDER:
    "pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",

  CREDENTIAL_OAUTH2_DISPLAY_NAME: "HubSpot OAuth2",
  CREDENTIAL_OAUTH2_DESCRIPTION: "Authenticate with HubSpot using OAuth2.",
  CREDENTIAL_OAUTH2_CLIENT_ID_LABEL: "Client ID",
  CREDENTIAL_OAUTH2_CLIENT_ID_PLACEHOLDER:
    "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  CREDENTIAL_OAUTH2_CLIENT_ID_HINT:
    "The client ID from your HubSpot app settings.",
  CREDENTIAL_OAUTH2_CLIENT_SECRET_LABEL: "Client Secret",
  CREDENTIAL_OAUTH2_CLIENT_SECRET_HINT:
    "The client secret from your HubSpot app settings.",

  // ── Shared Parameters ───────────────────────────────────────────
  PARAM_TOKEN_CREDENTIAL_LABEL: "HubSpot Token Credential",
  PARAM_OAUTH2_CREDENTIAL_LABEL: "HubSpot OAuth2 Credential",
  PARAM_OBJECT_TYPE_LABEL: "Object Type",
  PARAM_OBJECT_TYPE_HINT:
    "The CRM object type (e.g. contacts, companies, deals, tickets, line_items, products, or a custom object type).",
  PARAM_OBJECT_TYPE_PLACEHOLDER: "contacts",
  PARAM_OBJECT_ID_LABEL: "Object ID",
  PARAM_OBJECT_ID_HINT: "The ID of the HubSpot object.",
  PARAM_OBJECT_ID_PLACEHOLDER: "12345",
  PARAM_PROPERTIES_LABEL: "Properties",
  PARAM_PROPERTIES_HINT:
    "The properties to set on the object. Fields are dynamically discovered from your HubSpot schema.",
  PARAM_PROPERTIES_EMPTY_NOTICE:
    "Please select an object type to load available properties.",
  PARAM_SEARCH_QUERY_LABEL: "Search Query",
  PARAM_SEARCH_QUERY_HINT:
    "A text query to search objects by. Searches across default searchable properties.",
  PARAM_SEARCH_QUERY_PLACEHOLDER: "john@example.com",
  PARAM_FILTER_GROUPS_LABEL: "Filter Groups",
  PARAM_FILTER_GROUPS_HINT:
    "Filter groups for advanced search. Groups are combined with OR; filters within a group are combined with AND.",
  PARAM_FILTERS_LABEL: "Filters",
  PARAM_FILTER_PROPERTY_NAME_LABEL: "Property Name",
  PARAM_FILTER_OPERATOR_LABEL: "Operator",
  PARAM_FILTER_VALUE_LABEL: "Value",
  FILTER_OP_EQ: "Equal to",
  FILTER_OP_NEQ: "Not equal to",
  FILTER_OP_LT: "Less than",
  FILTER_OP_LTE: "Less than or equal to",
  FILTER_OP_GT: "Greater than",
  FILTER_OP_GTE: "Greater than or equal to",
  FILTER_OP_CONTAINS: "Contains token",
  FILTER_OP_NOT_CONTAINS: "Does not contain token",
  FILTER_OP_HAS_PROPERTY: "Has property",
  FILTER_OP_NOT_HAS_PROPERTY: "Does not have property",
  PARAM_LIMIT_LABEL: "Limit",
  PARAM_LIMIT_HINT: "Maximum number of results to return.",
  PARAM_RETURN_PROPERTIES_LABEL: "Return Properties",
  PARAM_RETURN_PROPERTIES_HINT:
    "Comma-separated list of properties to include in the response.",
  PARAM_RETURN_ASSOCIATIONS_LABEL: "Return Associations",
  PARAM_RETURN_ASSOCIATIONS_HINT:
    "Comma-separated list of association types to include (e.g. contacts, companies).",
  PARAM_UPSERT_LABEL: "Create or Update (Upsert)",
  PARAM_UPSERT_HINT:
    "If enabled, creates the object if it doesn't exist. Requires ID Property.",
  PARAM_ID_PROPERTY_LABEL: "ID Property",
  PARAM_ID_PROPERTY_HINT:
    "The property to use as the unique identifier for upsert (e.g. email for contacts).",
  PARAM_ID_PROPERTY_PLACEHOLDER: "email",

  // ── CRM > Contacts ─────────────────────────────────────────────
  CREATE_CONTACT_DISPLAY_NAME: "Create Contact",
  CREATE_CONTACT_DESCRIPTION: "Create a new contact in HubSpot CRM.",
  GET_CONTACT_DISPLAY_NAME: "Get Contact",
  GET_CONTACT_DESCRIPTION: "Retrieve a contact by ID from HubSpot CRM.",
  UPDATE_CONTACT_DISPLAY_NAME: "Update Contact",
  UPDATE_CONTACT_DESCRIPTION:
    "Update a contact in HubSpot CRM. Supports upsert by email.",
  FIND_CONTACT_DISPLAY_NAME: "Find Contact",
  FIND_CONTACT_DESCRIPTION:
    "Search for contacts in HubSpot CRM using filters or text query.",

  // ── CRM > Companies ────────────────────────────────────────────
  CREATE_COMPANY_DISPLAY_NAME: "Create Company",
  CREATE_COMPANY_DESCRIPTION: "Create a new company in HubSpot CRM.",
  GET_COMPANY_DISPLAY_NAME: "Get Company",
  GET_COMPANY_DESCRIPTION: "Retrieve a company by ID from HubSpot CRM.",
  UPDATE_COMPANY_DISPLAY_NAME: "Update Company",
  UPDATE_COMPANY_DESCRIPTION:
    "Update a company in HubSpot CRM. Supports upsert by domain.",
  FIND_COMPANY_DISPLAY_NAME: "Find Company",
  FIND_COMPANY_DESCRIPTION:
    "Search for companies in HubSpot CRM using filters or text query.",

  // ── CRM > Deals ────────────────────────────────────────────────
  CREATE_DEAL_DISPLAY_NAME: "Create Deal",
  CREATE_DEAL_DESCRIPTION: "Create a new deal in HubSpot CRM.",
  GET_DEAL_DISPLAY_NAME: "Get Deal",
  GET_DEAL_DESCRIPTION: "Retrieve a deal by ID from HubSpot CRM.",
  UPDATE_DEAL_DISPLAY_NAME: "Update Deal",
  UPDATE_DEAL_DESCRIPTION: "Update a deal in HubSpot CRM.",
  FIND_DEAL_DISPLAY_NAME: "Find Deal",
  FIND_DEAL_DESCRIPTION:
    "Search for deals in HubSpot CRM using filters or text query.",

  // ── CRM > Tickets ──────────────────────────────────────────────
  CREATE_TICKET_DISPLAY_NAME: "Create Ticket",
  CREATE_TICKET_DESCRIPTION: "Create a new ticket in HubSpot CRM.",
  GET_TICKET_DISPLAY_NAME: "Get Ticket",
  GET_TICKET_DESCRIPTION: "Retrieve a ticket by ID from HubSpot CRM.",
  UPDATE_TICKET_DISPLAY_NAME: "Update Ticket",
  UPDATE_TICKET_DESCRIPTION: "Update a ticket in HubSpot CRM.",
  FIND_TICKET_DISPLAY_NAME: "Find Ticket",
  FIND_TICKET_DESCRIPTION:
    "Search for tickets in HubSpot CRM using filters or text query.",

  // ── CRM > Line Items ──────────────────────────────────────────
  CREATE_LINE_ITEM_DISPLAY_NAME: "Create Line Item",
  CREATE_LINE_ITEM_DESCRIPTION: "Create a new line item in HubSpot CRM.",
  GET_LINE_ITEM_DISPLAY_NAME: "Get Line Item",
  GET_LINE_ITEM_DESCRIPTION: "Retrieve a line item by ID from HubSpot CRM.",
  UPDATE_LINE_ITEM_DISPLAY_NAME: "Update Line Item",
  UPDATE_LINE_ITEM_DESCRIPTION: "Update a line item in HubSpot CRM.",
  FIND_LINE_ITEM_DISPLAY_NAME: "Find Line Item",
  FIND_LINE_ITEM_DESCRIPTION:
    "Search for line items in HubSpot CRM using filters or text query.",

  // ── CRM > Products ────────────────────────────────────────────
  CREATE_PRODUCT_DISPLAY_NAME: "Create Product",
  CREATE_PRODUCT_DESCRIPTION: "Create a new product in HubSpot CRM.",
  GET_PRODUCT_DISPLAY_NAME: "Get Product",
  GET_PRODUCT_DESCRIPTION: "Retrieve a product by ID from HubSpot CRM.",
  UPDATE_PRODUCT_DISPLAY_NAME: "Update Product",
  UPDATE_PRODUCT_DESCRIPTION: "Update a product in HubSpot CRM.",
  FIND_PRODUCT_DISPLAY_NAME: "Find Product",
  FIND_PRODUCT_DESCRIPTION:
    "Search for products in HubSpot CRM using filters or text query.",

  // ── CRM > Objects (Generic) ───────────────────────────────────
  CREATE_CRM_OBJECT_DISPLAY_NAME: "Create CRM Object",
  CREATE_CRM_OBJECT_DESCRIPTION:
    "Create a new object of any type in HubSpot CRM.",
  GET_CRM_OBJECT_DISPLAY_NAME: "Get CRM Object",
  GET_CRM_OBJECT_DESCRIPTION:
    "Retrieve an object of any type by ID from HubSpot CRM.",
  UPDATE_CRM_OBJECT_DISPLAY_NAME: "Update CRM Object",
  UPDATE_CRM_OBJECT_DESCRIPTION: "Update an object of any type in HubSpot CRM.",
  DELETE_CRM_OBJECT_DISPLAY_NAME: "Delete CRM Object",
  DELETE_CRM_OBJECT_DESCRIPTION:
    "Delete an object of any type from HubSpot CRM.",
  FIND_CRM_OBJECT_DISPLAY_NAME: "Find CRM Object",
  FIND_CRM_OBJECT_DESCRIPTION: "Search for objects of any type in HubSpot CRM.",

  // ── CRM > Associations ────────────────────────────────────────
  CREATE_ASSOCIATIONS_DISPLAY_NAME: "Create Associations",
  CREATE_ASSOCIATIONS_DESCRIPTION:
    "Create associations between HubSpot CRM objects.",
  REMOVE_ASSOCIATIONS_DISPLAY_NAME: "Remove Associations",
  REMOVE_ASSOCIATIONS_DESCRIPTION:
    "Remove associations between HubSpot CRM objects.",
  FIND_ASSOCIATIONS_DISPLAY_NAME: "Find Associations",
  FIND_ASSOCIATIONS_DESCRIPTION:
    "Find associations between HubSpot CRM objects.",
  PARAM_FROM_OBJECT_TYPE_LABEL: "From Object Type",
  PARAM_FROM_OBJECT_TYPE_HINT:
    "The source object type (e.g. contacts, companies, deals).",
  PARAM_TO_OBJECT_TYPE_LABEL: "To Object Type",
  PARAM_TO_OBJECT_TYPE_HINT:
    "The target object type (e.g. contacts, companies, deals).",
  PARAM_FROM_OBJECT_ID_LABEL: "From Object ID",
  PARAM_FROM_OBJECT_ID_HINT: "The ID of the source object.",
  PARAM_TO_OBJECT_ID_LABEL: "To Object ID",
  PARAM_TO_OBJECT_ID_HINT: "The ID of the target object.",
  PARAM_ASSOCIATION_INPUTS_LABEL: "Association Pairs",
  PARAM_ASSOCIATION_INPUTS_HINT:
    "Pairs of object IDs to associate or disassociate.",
  PARAM_FROM_ID_LABEL: "From ID",
  PARAM_TO_ID_LABEL: "To ID",
  PARAM_FROM_IDS_LABEL: "From Object IDs",
  PARAM_FROM_IDS_HINT:
    "Comma-separated IDs of source objects to find associations for.",

  // ── CRM > Owners ──────────────────────────────────────────────
  GET_OWNER_BY_EMAIL_DISPLAY_NAME: "Get Owner by Email",
  GET_OWNER_BY_EMAIL_DESCRIPTION:
    "Retrieve a HubSpot owner by their email address.",
  GET_OWNER_BY_ID_DISPLAY_NAME: "Get Owner by ID",
  GET_OWNER_BY_ID_DESCRIPTION: "Retrieve a HubSpot owner by their ID.",
  PARAM_OWNER_EMAIL_LABEL: "Owner Email",
  PARAM_OWNER_EMAIL_HINT: "The email address of the HubSpot owner.",
  PARAM_OWNER_EMAIL_PLACEHOLDER: "owner@company.com",
  PARAM_OWNER_ID_LABEL: "Owner ID",
  PARAM_OWNER_ID_HINT: "The ID of the HubSpot owner.",
  PARAM_OWNER_ID_PLACEHOLDER: "12345678",

  // ── CRM > Pipelines ──────────────────────────────────────────
  GET_PIPELINE_STAGE_DETAILS_DISPLAY_NAME: "Get Pipeline Stage Details",
  GET_PIPELINE_STAGE_DETAILS_DESCRIPTION:
    "Retrieve pipeline and stage details for a HubSpot object type.",
  PARAM_PIPELINE_OBJECT_TYPE_LABEL: "Pipeline Object Type",
  PARAM_PIPELINE_OBJECT_TYPE_HINT:
    "The object type to get pipelines for (e.g. deals, tickets).",

  // ── CRM > Lists (Segments) ───────────────────────────────────
  CREATE_LIST_DISPLAY_NAME: "Create List (Segment)",
  CREATE_LIST_DESCRIPTION: "Create a new static or dynamic list in HubSpot.",
  ADD_CONTACT_TO_LIST_DISPLAY_NAME: "Add Contact to List",
  ADD_CONTACT_TO_LIST_DESCRIPTION:
    "Add one or more contacts to a HubSpot list.",
  REMOVE_CONTACT_FROM_LIST_DISPLAY_NAME: "Remove Contact from List",
  REMOVE_CONTACT_FROM_LIST_DESCRIPTION:
    "Remove one or more contacts from a HubSpot list.",
  PARAM_LIST_NAME_LABEL: "List Name",
  PARAM_LIST_NAME_HINT: "The name of the list to create.",
  PARAM_LIST_NAME_PLACEHOLDER: "My Custom List",
  PARAM_LIST_OBJECT_TYPE_ID_LABEL: "Object Type ID",
  PARAM_LIST_OBJECT_TYPE_ID_HINT:
    "The object type for the list (e.g. 0-1 for contacts).",
  PARAM_LIST_PROCESSING_TYPE_LABEL: "Processing Type",
  PARAM_LIST_PROCESSING_TYPE_HINT:
    "Whether the list is MANUAL (static) or SNAPSHOT (dynamic).",
  LIST_PROCESSING_TYPE_MANUAL: "Manual (Static)",
  LIST_PROCESSING_TYPE_SNAPSHOT: "Snapshot (Dynamic)",
  PARAM_LIST_ID_LABEL: "List ID",
  PARAM_LIST_ID_HINT: "The ID of the list.",
  PARAM_LIST_ID_PLACEHOLDER: "12345",
  PARAM_CONTACT_IDS_LABEL: "Contact IDs",
  PARAM_CONTACT_IDS_HINT: "Comma-separated contact IDs to add or remove.",

  // ── CRM > Engagements ─────────────────────────────────────────
  CREATE_ENGAGEMENT_DISPLAY_NAME: "Create Engagement",
  CREATE_ENGAGEMENT_DESCRIPTION:
    "Create an engagement (call, email, meeting, task, or note) in HubSpot.",
  PARAM_ENGAGEMENT_TYPE_LABEL: "Engagement Type",
  PARAM_ENGAGEMENT_TYPE_HINT: "The type of engagement to create.",
  ENGAGEMENT_TYPE_CALL: "Call",
  ENGAGEMENT_TYPE_EMAIL: "Email",
  ENGAGEMENT_TYPE_MEETING: "Meeting",
  ENGAGEMENT_TYPE_TASK: "Task",
  ENGAGEMENT_TYPE_NOTE: "Note",
  PARAM_ENGAGEMENT_PROPERTIES_LABEL: "Engagement Properties",
  PARAM_ENGAGEMENT_PROPERTIES_HINT:
    "Properties for the engagement. Fields vary by engagement type.",

  // ── Marketing > Forms ─────────────────────────────────────────
  CREATE_FORM_SUBMISSION_DISPLAY_NAME: "Create Form Submission",
  CREATE_FORM_SUBMISSION_DESCRIPTION: "Submit data to a HubSpot form.",
  PARAM_PORTAL_ID_LABEL: "Portal ID",
  PARAM_PORTAL_ID_HINT: "Your HubSpot portal (account) ID.",
  PARAM_PORTAL_ID_PLACEHOLDER: "12345678",
  PARAM_FORM_GUID_LABEL: "Form GUID",
  PARAM_FORM_GUID_HINT: "The unique identifier of the form.",
  PARAM_FORM_GUID_PLACEHOLDER: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  PARAM_FORM_FIELDS_LABEL: "Form Fields",
  PARAM_FORM_FIELDS_HINT:
    "Key-value pairs of form field names and their values.",

  // ── Marketing > Email Subscriptions ───────────────────────────
  REMOVE_EMAIL_SUBSCRIPTION_DISPLAY_NAME: "Remove Email Subscription",
  REMOVE_EMAIL_SUBSCRIPTION_DESCRIPTION:
    "Unsubscribe an email address from a HubSpot subscription type.",
  UPDATE_SUBSCRIPTION_PREFERENCES_DISPLAY_NAME:
    "Update Contact Subscription Preferences",
  UPDATE_SUBSCRIPTION_PREFERENCES_DESCRIPTION:
    "Update email subscription preferences for a contact in HubSpot.",
  PARAM_EMAIL_ADDRESS_LABEL: "Email Address",
  PARAM_EMAIL_ADDRESS_HINT: "The email address to update subscriptions for.",
  PARAM_EMAIL_ADDRESS_PLACEHOLDER: "contact@example.com",
  PARAM_SUBSCRIPTION_ID_LABEL: "Subscription ID",
  PARAM_SUBSCRIPTION_ID_HINT: "The ID of the subscription type.",
  PARAM_SUBSCRIPTION_STATUSES_LABEL: "Subscription Statuses",
  PARAM_SUBSCRIPTION_STATUSES_HINT:
    "List of subscription IDs and their subscribed status.",
  PARAM_SUBSCRIPTION_STATUS_ID_LABEL: "Subscription Type ID",
  PARAM_SUBSCRIPTION_STATUS_SUBSCRIBED_LABEL: "Subscribed",
  PARAM_LEGAL_BASIS_LABEL: "Legal Basis",
  PARAM_LEGAL_BASIS_HINT:
    "The legal basis for updating the subscription (e.g. CONSENT_WITH_NOTICE).",
  PARAM_LEGAL_BASIS_EXPLANATION_LABEL: "Legal Basis Explanation",
  PARAM_LEGAL_BASIS_EXPLANATION_HINT:
    "Explanation of the legal basis for the subscription change.",

  // ── Marketing > Social ────────────────────────────────────────
  CREATE_SOCIAL_MESSAGE_DISPLAY_NAME: "Create Social Media Message",
  CREATE_SOCIAL_MESSAGE_DESCRIPTION:
    "Create and schedule a social media message through HubSpot.",
  PARAM_SOCIAL_CHANNEL_GUID_LABEL: "Channel GUID",
  PARAM_SOCIAL_CHANNEL_GUID_HINT:
    "The unique identifier of the social media channel.",
  PARAM_SOCIAL_CONTENT_LABEL: "Message Content",
  PARAM_SOCIAL_CONTENT_HINT: "The content of the social media message.",
  PARAM_SOCIAL_CONTENT_PLACEHOLDER: "Check out our new product!",

  // ── Automation > Workflows ────────────────────────────────────
  ADD_CONTACT_TO_WORKFLOW_DISPLAY_NAME: "Add Contact to Workflow",
  ADD_CONTACT_TO_WORKFLOW_DESCRIPTION:
    "Enroll a contact into a HubSpot workflow by email.",
  PARAM_WORKFLOW_ID_LABEL: "Workflow ID",
  PARAM_WORKFLOW_ID_HINT: "The ID of the workflow to enroll the contact in.",
  PARAM_WORKFLOW_ID_PLACEHOLDER: "12345678",
  PARAM_WORKFLOW_CONTACT_EMAIL_LABEL: "Contact Email",
  PARAM_WORKFLOW_CONTACT_EMAIL_HINT:
    "The email address of the contact to enroll.",

  // ── CMS > Blog ────────────────────────────────────────────────
  CREATE_BLOG_POST_DISPLAY_NAME: "Create COS Blog Post",
  CREATE_BLOG_POST_DESCRIPTION: "Create a new blog post in HubSpot CMS.",
  PARAM_BLOG_POST_NAME_LABEL: "Post Title",
  PARAM_BLOG_POST_NAME_HINT: "The title of the blog post.",
  PARAM_BLOG_POST_NAME_PLACEHOLDER: "My New Blog Post",
  PARAM_BLOG_CONTENT_GROUP_ID_LABEL: "Blog ID (Content Group)",
  PARAM_BLOG_CONTENT_GROUP_ID_HINT: "The ID of the blog to publish to.",
  PARAM_BLOG_POST_BODY_LABEL: "Post Body",
  PARAM_BLOG_POST_BODY_HINT: "The HTML body of the blog post.",
  PARAM_BLOG_POST_SLUG_LABEL: "Slug",
  PARAM_BLOG_POST_SLUG_HINT: "The URL slug for the blog post.",
  PARAM_BLOG_POST_STATE_LABEL: "State",
  PARAM_BLOG_POST_STATE_HINT: "The publish state of the blog post.",
  OPTION_DRAFT: "Draft",
  OPTION_PUBLISHED: "Published",
  PARAM_BLOG_POST_META_DESCRIPTION_LABEL: "Meta Description",
  PARAM_BLOG_POST_META_DESCRIPTION_HINT: "The meta description for SEO.",

  // ── Events ────────────────────────────────────────────────────
  CREATE_ENTERPRISE_EVENT_DISPLAY_NAME: "Create Enterprise Event",
  CREATE_ENTERPRISE_EVENT_DESCRIPTION:
    "Send a custom behavioral event to HubSpot.",
  PARAM_EVENT_NAME_LABEL: "Event Name",
  PARAM_EVENT_NAME_HINT: "The internal name of the event definition.",
  PARAM_EVENT_NAME_PLACEHOLDER: "pe12345_my_event",
  PARAM_EVENT_EMAIL_LABEL: "Contact Email",
  PARAM_EVENT_EMAIL_HINT:
    "The email of the contact to associate the event with.",
  PARAM_EVENT_PROPERTIES_LABEL: "Event Properties",
  PARAM_EVENT_PROPERTIES_HINT: "Key-value pairs of custom event properties.",

  // ── Files ─────────────────────────────────────────────────────
  GET_FILE_PUBLIC_URL_DISPLAY_NAME: "Get File Public URL",
  GET_FILE_PUBLIC_URL_DESCRIPTION:
    "Retrieve the public URL of a file in HubSpot.",
  UPLOAD_FILE_DISPLAY_NAME: "Upload File",
  UPLOAD_FILE_DESCRIPTION: "Upload a file to HubSpot file manager.",
  PARAM_FILE_ID_LABEL: "File ID",
  PARAM_FILE_ID_HINT: "The ID of the file.",
  PARAM_FILE_ID_PLACEHOLDER: "12345678",
  PARAM_FILE_NAME_LABEL: "File Name",
  PARAM_FILE_NAME_HINT: "The name for the uploaded file.",
  PARAM_FILE_NAME_PLACEHOLDER: "document.pdf",
  PARAM_FILE_CONTENT_LABEL: "File Content",
  PARAM_FILE_CONTENT_HINT: "The file content to upload (base64 encoded).",
  PARAM_FILE_FOLDER_ID_LABEL: "Folder ID",
  PARAM_FILE_FOLDER_ID_HINT: "The ID of the folder to upload to (optional).",
  PARAM_FILE_ACCESS_LABEL: "Access",
  PARAM_FILE_ACCESS_HINT: "The access level for the file.",
  OPTION_PRIVATE: "Private",
  OPTION_PUBLIC_INDEXABLE: "Public (Indexable)",
  OPTION_PUBLIC_NOT_INDEXABLE: "Public (Not Indexable)",

  // ── Errors ────────────────────────────────────────────────────
  ERROR_MISSING_CREDENTIAL:
    "Missing HubSpot credential. Please provide a Private App Token or OAuth2 credential.",
} satisfies BaseTranslation

export default en_US
