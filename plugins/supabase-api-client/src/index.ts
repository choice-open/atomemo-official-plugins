import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { supabaseCredential } from "./credentials/supabase-connection"
import { supabaseQueryTool } from "./tools/supabase-query"
import { supabaseInsertTool } from "./tools/supabase-insert"
import { supabaseUpdateTool } from "./tools/supabase-update"
import { supabaseUpsertTool } from "./tools/supabase-upsert"
import { supabaseDeleteTool } from "./tools/supabase-delete"
import { supabaseRpcTool } from "./tools/supabase-rpc"
import { supabaseAuthSignInTool } from "./tools/supabase-auth-sign-in"
import { supabaseAuthSignUpTool } from "./tools/supabase-auth-sign-up"
import { supabaseAuthSignOutTool } from "./tools/supabase-auth-sign-out"
import { supabaseAuthGetUserTool } from "./tools/supabase-auth-get-user"
import { supabaseAuthGetSessionTool } from "./tools/supabase-auth-get-session"
import { supabaseAuthResetPasswordTool } from "./tools/supabase-auth-reset-password"
import { supabaseAuthVerifyOtpTool } from "./tools/supabase-auth-verify-otp"
import { supabaseAuthSetSessionTool } from "./tools/supabase-auth-set-session"
import { supabaseAuthUpdateUserTool } from "./tools/supabase-auth-update-user"
import { supabaseAuthResendOtpTool } from "./tools/supabase-auth-resend-otp"
import { supabaseAuthExchangeCodeForSessionTool } from "./tools/supabase-auth-exchange-code-for-session"
import { supabaseAuthSignInAnonymouslyTool } from "./tools/supabase-auth-sign-in-anonymously"
import { supabaseAuthSignInWithOtpTool } from "./tools/supabase-auth-sign-in-with-otp"
import { supabaseAuthSignInWithIdTokenTool } from "./tools/supabase-auth-sign-in-with-id-token"
import { supabaseAuthSignInWithOAuthTool } from "./tools/supabase-auth-sign-in-with-oauth"
import { supabaseAuthGetClaimsTool } from "./tools/supabase-auth-get-claims"
import { supabaseAuthAdminOAuthListClientsTool } from "./tools/supabase-auth-admin-oauth-list-clients"
import { supabaseAuthAdminOAuthCreateClientTool } from "./tools/supabase-auth-admin-oauth-create-client"
import { supabaseAuthAdminOAuthGetClientTool } from "./tools/supabase-auth-admin-oauth-get-client"
import { supabaseAuthAdminOAuthUpdateClientTool } from "./tools/supabase-auth-admin-oauth-update-client"
import { supabaseAuthAdminOAuthDeleteClientTool } from "./tools/supabase-auth-admin-oauth-delete-client"
import { supabaseAuthAdminOAuthRegenerateSecretTool } from "./tools/supabase-auth-admin-oauth-regenerate-secret"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🎛️",
  lang: "typescript",
  version: packageJSON.version,
  repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/supabase-api-client",
  locales,
  transporterOptions: {},
})

plugin.addCredential(supabaseCredential)
plugin.addTool(supabaseQueryTool)
plugin.addTool(supabaseInsertTool)
plugin.addTool(supabaseUpdateTool)
plugin.addTool(supabaseUpsertTool)
plugin.addTool(supabaseDeleteTool)
plugin.addTool(supabaseRpcTool)
plugin.addTool(supabaseAuthSignInTool)
plugin.addTool(supabaseAuthSignUpTool)
plugin.addTool(supabaseAuthSignOutTool)
plugin.addTool(supabaseAuthGetUserTool)
plugin.addTool(supabaseAuthGetSessionTool)
plugin.addTool(supabaseAuthResetPasswordTool)
plugin.addTool(supabaseAuthVerifyOtpTool)
plugin.addTool(supabaseAuthSetSessionTool)
plugin.addTool(supabaseAuthUpdateUserTool)
plugin.addTool(supabaseAuthResendOtpTool)
plugin.addTool(supabaseAuthExchangeCodeForSessionTool)
plugin.addTool(supabaseAuthSignInAnonymouslyTool)
plugin.addTool(supabaseAuthSignInWithOtpTool)
plugin.addTool(supabaseAuthSignInWithIdTokenTool)
plugin.addTool(supabaseAuthSignInWithOAuthTool)
plugin.addTool(supabaseAuthGetClaimsTool)
plugin.addTool(supabaseAuthAdminOAuthListClientsTool)
plugin.addTool(supabaseAuthAdminOAuthCreateClientTool)
plugin.addTool(supabaseAuthAdminOAuthGetClientTool)
plugin.addTool(supabaseAuthAdminOAuthUpdateClientTool)
plugin.addTool(supabaseAuthAdminOAuthDeleteClientTool)
plugin.addTool(supabaseAuthAdminOAuthRegenerateSecretTool)

plugin.run()
