import type { BaseTranslation } from "../i18n-types"

const en_US = {
  PLUGIN_DISPLAY_NAME: "Testing Plugin",
  PLUGIN_DESCRIPTION: "A plugin for testing the plugin",
  M365_CREDENTIAL_DISPLAY_NAME: "Microsoft 365 OAuth2",
  M365_CREDENTIAL_DESCRIPTION:
    "OAuth2 credential for accessing Microsoft Graph APIs.",
  M365_CLIENT_ID_DISPLAY_NAME: "Client ID",
  M365_CLIENT_ID_PLACEHOLDER:
    "Enter your Microsoft Entra application client ID",
  M365_CLIENT_SECRET_DISPLAY_NAME: "Client Secret",
  M365_CLIENT_SECRET_PLACEHOLDER:
    "Enter your Microsoft Entra application client secret",
  M365_TENANT_DISPLAY_NAME: "Tenant",
  M365_TENANT_HINT:
    "Choose common, organizations, consumers, or custom tenant.",
  M365_CUSTOM_TENANT_ID_DISPLAY_NAME: "Custom Tenant ID",
  M365_CUSTOM_TENANT_ID_PLACEHOLDER:
    "Enter your custom tenant ID (GUID or domain)",
  DEMO_TOOL_DISPLAY_NAME: "Demo Tool",
  DEMO_TOOL_DESCRIPTION: "A tool for testing the plugin",
  DEMO_CREDENTIAL_DISPLAY_NAME: "Credential",
  DEMO_CREDENTIAL_HINT: "Select a configured Microsoft 365 OAuth2 credential.",
  LOCATION_DISPLAY_NAME: "Location",
  LOCATION_HINT: "The location to test",
  LOCATION_PLACEHOLDER: "Enter the location to test",
} satisfies BaseTranslation

export default en_US
