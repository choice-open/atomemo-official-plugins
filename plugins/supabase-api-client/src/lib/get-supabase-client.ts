import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const CREDENTIAL_PARAM = "supabase_credential" as const

/** 缺少凭证时返回的错误对象，工具可直接 return */
export const MISSING_CREDENTIAL_ERROR = {
  success: false,
  error: "Missing Supabase credential (supabase_url or supabase_key).",
  data: null,
  code: null,
} as const

export type MissingCredentialError = typeof MISSING_CREDENTIAL_ERROR

export type CredentialMap = Record<
  string,
  | {
      supabase_url?: string | null
      supabase_key?: string | null
      supabase_service_role_key?: string | null
    }
  | undefined
>

export type GetSupabaseClientOptions = { useServiceRoleKey?: boolean }

export type InvokeArgsLike = {
  parameters?: Record<string, unknown> | null
  credentials?: CredentialMap | null
}

export type GetSupabaseClientSuccess = { supabase: SupabaseClient; error: null }
export type GetSupabaseClientFailure = {
  supabase: null
  error: MissingCredentialError
}
export type GetSupabaseClientResult =
  | GetSupabaseClientSuccess
  | GetSupabaseClientFailure

function getCredential(
  parameters: Record<string, unknown> | undefined,
  credentials: CredentialMap | undefined,
  paramName: string,
  options?: GetSupabaseClientOptions,
): { supabase_url: string; supabase_key: string } | null {
  const id = parameters?.[paramName]
  if (id == null || typeof id !== "string") return null
  const cred = credentials?.[id]
  if (!cred) return null
  const url =
    typeof cred.supabase_url === "string" ? cred.supabase_url.trim() : ""
  const useServiceRole =
    options?.useServiceRoleKey === true &&
    typeof cred.supabase_service_role_key === "string" &&
    cred.supabase_service_role_key.trim().length > 0
  const key = useServiceRole
    ? (cred.supabase_service_role_key as string).trim()
    : typeof cred.supabase_key === "string"
      ? cred.supabase_key.trim()
      : ""
  if (!url || !key) return null
  return { supabase_url: url, supabase_key: key }
}

/**
 * 从 invoke args 解析凭证并创建 Supabase 客户端。
 * 使用 parameters[credentialParamName] 作为凭证 ID，在 credentials 中查找。
 * @param argsOrParameters - 完整 args 或 parameters
 * @param credentialsOrParamName - credentials 或凭证参数名（传 args 时可选）
 * @param credentialParamNameOrOptions - 凭证参数名或 options（三参数调用时）
 * @param options - useServiceRoleKey: 为 true 时优先使用凭证中的 supabase_service_role_key
 * @returns 成功返回 { supabase, error: null }，失败返回 { supabase: null, error }，可直接 return error
 */
export function getSupabaseClientFromArgs(
  args: InvokeArgsLike,
  credentialParamName?: string,
  options?: GetSupabaseClientOptions,
): GetSupabaseClientResult
export function getSupabaseClientFromArgs(
  parameters: Record<string, unknown> | undefined,
  credentials: CredentialMap | undefined,
  credentialParamName?: string,
  options?: GetSupabaseClientOptions,
): GetSupabaseClientResult
export function getSupabaseClientFromArgs(
  argsOrParameters: InvokeArgsLike | Record<string, unknown> | undefined,
  credentialsOrParamName?: CredentialMap | string,
  credentialParamNameOrOptions?: string | GetSupabaseClientOptions,
  options?: GetSupabaseClientOptions,
): GetSupabaseClientResult {
  const isArgs =
    argsOrParameters != null &&
    typeof argsOrParameters === "object" &&
    "parameters" in argsOrParameters &&
    "credentials" in argsOrParameters &&
    (credentialsOrParamName === undefined ||
      typeof credentialsOrParamName === "string")

  const parameters = isArgs
    ? ((argsOrParameters as InvokeArgsLike).parameters ?? undefined)
    : (argsOrParameters as Record<string, unknown> | undefined)
  const credentials = isArgs
    ? ((argsOrParameters as InvokeArgsLike).credentials ?? undefined)
    : (credentialsOrParamName as CredentialMap | undefined)
  const paramName = isArgs
    ? ((credentialsOrParamName as string) ?? CREDENTIAL_PARAM)
    : typeof credentialParamNameOrOptions === "string"
      ? credentialParamNameOrOptions
      : CREDENTIAL_PARAM
  const opts: GetSupabaseClientOptions | undefined = isArgs
    ? (credentialParamNameOrOptions as GetSupabaseClientOptions | undefined)
    : typeof credentialParamNameOrOptions === "object" &&
        credentialParamNameOrOptions !== null
      ? credentialParamNameOrOptions
      : options

  const cred = getCredential(parameters, credentials, paramName, opts)
  if (!cred) return { supabase: null, error: MISSING_CREDENTIAL_ERROR }
  return {
    supabase: createClient(cred.supabase_url, cred.supabase_key),
    error: null,
  }
}

export function createSupabaseClient(url: string, key: string): SupabaseClient {
  return createClient(url.trim(), key.trim())
}
