import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import packageJSON from "../package.json"
import { supabaseCredential } from "./credentials/supabase-connection"
import { t } from "./i18n/i18n-node"
import { locales } from "./i18n/i18n-util"
import { loadAllLocalesAsync } from "./i18n/i18n-util.async"
import { supabaseAuthAdminOAuthCreateClientTool } from "./tools/supabase-auth-admin-oauth-create-client"
import { supabaseAuthAdminOAuthDeleteClientTool } from "./tools/supabase-auth-admin-oauth-delete-client"
import { supabaseAuthAdminOAuthGetClientTool } from "./tools/supabase-auth-admin-oauth-get-client"
import { supabaseAuthAdminOAuthListClientsTool } from "./tools/supabase-auth-admin-oauth-list-clients"
import { supabaseAuthAdminOAuthRegenerateSecretTool } from "./tools/supabase-auth-admin-oauth-regenerate-secret"
import { supabaseAuthAdminOAuthUpdateClientTool } from "./tools/supabase-auth-admin-oauth-update-client"
import { supabaseAuthExchangeCodeForSessionTool } from "./tools/supabase-auth-exchange-code-for-session"
import { supabaseAuthGetClaimsTool } from "./tools/supabase-auth-get-claims"
import { supabaseAuthGetSessionTool } from "./tools/supabase-auth-get-session"
import { supabaseAuthGetUserTool } from "./tools/supabase-auth-get-user"
import { supabaseAuthResendOtpTool } from "./tools/supabase-auth-resend-otp"
import { supabaseAuthResetPasswordTool } from "./tools/supabase-auth-reset-password"
import { supabaseAuthSetSessionTool } from "./tools/supabase-auth-set-session"
import { supabaseAuthSignInTool } from "./tools/supabase-auth-sign-in"
import { supabaseAuthSignInAnonymouslyTool } from "./tools/supabase-auth-sign-in-anonymously"
import { supabaseAuthSignInWithIdTokenTool } from "./tools/supabase-auth-sign-in-with-id-token"
import { supabaseAuthSignInWithOAuthTool } from "./tools/supabase-auth-sign-in-with-oauth"
import { supabaseAuthSignInWithOtpTool } from "./tools/supabase-auth-sign-in-with-otp"
import { supabaseAuthSignOutTool } from "./tools/supabase-auth-sign-out"
import { supabaseAuthSignUpTool } from "./tools/supabase-auth-sign-up"
import { supabaseAuthUpdateUserTool } from "./tools/supabase-auth-update-user"
import { supabaseAuthVerifyOtpTool } from "./tools/supabase-auth-verify-otp"
import { supabaseDeleteTool } from "./tools/supabase-delete"
import { supabaseInsertTool } from "./tools/supabase-insert"
import { supabaseInvokeEdgeFunctionTool } from "./tools/supabase-invoke-edge-function"
import { supabaseQueryTool } from "./tools/supabase-query"
import { supabaseRpcTool } from "./tools/supabase-rpc"
import { supabaseStorageCreateSignedUrlTool } from "./tools/supabase-storage-create-signed-url"
import { supabaseStorageDownloadTool } from "./tools/supabase-storage-download"
import { supabaseStorageGetPublicUrlTool } from "./tools/supabase-storage-get-public-url"
import { supabaseStorageListBucketsTool } from "./tools/supabase-storage-list-buckets"
import { supabaseVectorCreateBucketTool } from "./tools/supabase-vector-create-bucket"
import { supabaseVectorDeleteBucketTool } from "./tools/supabase-vector-delete-bucket"
import { supabaseVectorDeleteIndexTool } from "./tools/supabase-vector-delete-index"
import { supabaseVectorDeleteTool } from "./tools/supabase-vector-delete"
import { supabaseVectorGetBucketTool } from "./tools/supabase-vector-get-bucket"
import { supabaseVectorGetIndexTool } from "./tools/supabase-vector-get-index"
import { supabaseVectorGetTool } from "./tools/supabase-vector-get"
import { supabaseVectorListBucketsTool } from "./tools/supabase-vector-list-buckets"
import { supabaseVectorListIndexesTool } from "./tools/supabase-vector-list-indexes"
import { supabaseVectorListTool } from "./tools/supabase-vector-list"
import { supabaseVectorPutTool } from "./tools/supabase-vector-put"
import { supabaseVectorQueryTool } from "./tools/supabase-vector-query"
import { supabaseVectorCreateIndexTool } from "./tools/supabase-vector-create-index"
import { supabaseStorageListFilesTool } from "./tools/supabase-storage-list-files"
import { supabaseStorageRemoveTool } from "./tools/supabase-storage-remove"
import { supabaseStorageUploadTool } from "./tools/supabase-storage-upload"
import { supabaseUpdateTool } from "./tools/supabase-update"
import { supabaseUpsertTool } from "./tools/supabase-upsert"

await loadAllLocalesAsync()

const plugin = await createPlugin({
  name: packageJSON.name,
  display_name: t("PLUGIN_DISPLAY_NAME"),
  description: t("PLUGIN_DESCRIPTION"),
  icon: "🗄️",
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
plugin.addTool(supabaseInvokeEdgeFunctionTool)
plugin.addTool(supabaseStorageListBucketsTool)
plugin.addTool(supabaseStorageListFilesTool)
plugin.addTool(supabaseStorageUploadTool)
plugin.addTool(supabaseStorageDownloadTool)
plugin.addTool(supabaseStorageRemoveTool)
plugin.addTool(supabaseStorageCreateSignedUrlTool)
plugin.addTool(supabaseStorageGetPublicUrlTool)
plugin.addTool(supabaseVectorListBucketsTool)
plugin.addTool(supabaseVectorCreateBucketTool)
plugin.addTool(supabaseVectorGetBucketTool)
plugin.addTool(supabaseVectorDeleteBucketTool)
plugin.addTool(supabaseVectorListIndexesTool)
plugin.addTool(supabaseVectorCreateIndexTool)
plugin.addTool(supabaseVectorGetIndexTool)
plugin.addTool(supabaseVectorDeleteIndexTool)
plugin.addTool(supabaseVectorPutTool)
plugin.addTool(supabaseVectorGetTool)
plugin.addTool(supabaseVectorListTool)
plugin.addTool(supabaseVectorQueryTool)
plugin.addTool(supabaseVectorDeleteTool)
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
