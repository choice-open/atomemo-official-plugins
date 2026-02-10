import type { PropertyCredentialId } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const firecrawlCredentialParameter: PropertyCredentialId<"credentialId"> =
  {
    name: "credentialId",
    type: "credential_id",
    credential_name: "firecrawl",
    display_name: {
      en_US: "Credential",
      zh_Hans_CN: "凭证",
    },
    required: true,
    ui: {
      component: "credential-select",
    },
  }
