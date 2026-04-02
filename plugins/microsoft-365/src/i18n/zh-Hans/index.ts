import type { Translation } from "../i18n-types"

const zh_Hans = {
  PLUGIN_DISPLAY_NAME: "测试插件",
  PLUGIN_DESCRIPTION: "一个用于测试插件的插件",
  M365_CREDENTIAL_DISPLAY_NAME: "Microsoft 365 OAuth2",
  M365_CREDENTIAL_DESCRIPTION: "用于访问 Microsoft Graph API 的 OAuth2 凭据。",
  M365_CLIENT_ID_DISPLAY_NAME: "Client ID",
  M365_CLIENT_ID_PLACEHOLDER: "输入 Microsoft Entra 应用的 Client ID",
  M365_CLIENT_SECRET_DISPLAY_NAME: "Client Secret",
  M365_CLIENT_SECRET_PLACEHOLDER: "输入 Microsoft Entra 应用的 Client Secret",
  M365_TENANT_DISPLAY_NAME: "Tenant",
  M365_TENANT_HINT: "选择 common、organizations、consumers 或 custom。",
  M365_CUSTOM_TENANT_ID_DISPLAY_NAME: "自定义 Tenant ID",
  M365_CUSTOM_TENANT_ID_PLACEHOLDER: "输入自定义租户 ID（GUID 或域名）",
  DEMO_TOOL_DISPLAY_NAME: "演示工具",
  DEMO_TOOL_DESCRIPTION: "一个用于测试插件的工具",
  DEMO_CREDENTIAL_DISPLAY_NAME: "凭据",
  DEMO_CREDENTIAL_HINT: "选择已配置的 Microsoft 365 OAuth2 凭据。",
  LOCATION_DISPLAY_NAME: "位置",
  LOCATION_HINT: "要测试的位置",
  LOCATION_PLACEHOLDER: "输入要测试的位置",
} satisfies Translation

export default zh_Hans
