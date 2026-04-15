import { z } from "zod"
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getAccessToken, resolveCredential } from "../../lib/dingtalk"
import { t } from "../../lib/i18n"
import { credentialParameter } from "../../lib/parameters"
import { parseParams } from "../../lib/schemas"

const paramsSchema = z.object({
  credential_id: z.string(),
})

export const getAppAccessTokenTool: ToolDefinition = {
  name: "dingtalk-auth-get-access-token",
  display_name: t("AUTH_TOOL_DISPLAY_NAME"),
  description: t("AUTH_TOOL_DESCRIPTION"),
  icon: "🔐",
  parameters: [credentialParameter],
  async invoke({ args }) {
    parseParams(paramsSchema, args.parameters)
    const credential = resolveCredential(args)
    const accessToken = await getAccessToken(credential)

    return {
      corpId: credential.corp_id ?? "",
      clientId: credential.client_id ?? "",
      accessToken,
    }
  },
}
