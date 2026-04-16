import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getAccessToken, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import getAppAccessTokenSkill from "../../skills/tools/get-app-access-token.md" with {
  type: "text",
}

export const getAppAccessTokenTool: ToolDefinition = {
  name: "dingtalk-auth-get-access-token",
  display_name: t("AUTH_TOOL_DISPLAY_NAME"),
  description: t("AUTH_TOOL_DESCRIPTION"),
  icon: "🔐",
  skill: getAppAccessTokenSkill,
  parameters: [credentialParameter],
  async invoke({ args }) {
    const credential = resolveCredential(args)
    // api doc url: https://open.dingtalk.com/document/orgapp/obtain-orgapp-token
    // 需要权限： 无额外接口权限（需提供应用 Client ID / Client Secret）
    const accessToken = await getAccessToken(credential)

    return {
      corpId: credential.corp_id ?? "",
      clientId: credential.client_id ?? "",
      accessToken,
    }
  },
}
