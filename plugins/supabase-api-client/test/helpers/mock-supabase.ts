/**
 * 创建可链式调用的 Supabase mock，用于工具单元测试
 */
export function createMockSupabaseClient(result: {
  data?: unknown
  error?: { message: string; code?: string } | null
  count?: number
} = {}) {
  const resolved = {
    data: result.data ?? [],
    error: result.error ?? null,
    count: result.count ?? null,
  }

  function createChain(methods: Record<string, unknown> = {}) {
    const chain = {
      ...methods,
      then(onFulfilled?: (v: typeof resolved) => unknown) {
        return Promise.resolve(resolved).then(onFulfilled)
      },
      single() {
        return Promise.resolve({
          ...resolved,
          data: Array.isArray(resolved.data) ? resolved.data[0] : resolved.data,
        })
      },
      maybeSingle() {
        return Promise.resolve({
          ...resolved,
          data: Array.isArray(resolved.data) ? resolved.data[0] ?? null : resolved.data,
        })
      },
      csv() {
        return Promise.resolve({
          data: "col1,col2\n1,2",
          error: resolved.error,
        })
      },
      explain() {
        return Promise.resolve({
          data: { Plan: {} },
          error: resolved.error,
        })
      },
    }
    return chain
  }

  const chainMethods: Record<string, () => unknown> = {}
  const c = createChain({
    get eq() { return () => c },
    get neq() { return () => c },
    get gt() { return () => c },
    get gte() { return () => c },
    get lt() { return () => c },
    get lte() { return () => c },
    get like() { return () => c },
    get ilike() { return () => c },
    get is() { return () => c },
    get in() { return () => c },
    get contains() { return () => c },
    get containedBy() { return () => c },
    get or() { return () => c },
    get order() { return () => c },
    get range() { return () => c },
  })

  const from = (table: string) => ({
    select: (_cols?: string) => c,
    insert: (rows: unknown, _opts?: unknown) => ({
      select: () => Promise.resolve(resolved),
      then: (onFulfilled?: (v: typeof resolved) => unknown) =>
        Promise.resolve(resolved).then(onFulfilled),
    }),
    upsert: (rows: unknown, _opts?: unknown) => ({
      select: () => Promise.resolve(resolved),
      then: (onFulfilled?: (v: typeof resolved) => unknown) =>
        Promise.resolve(resolved).then(onFulfilled),
    }),
    update: (values: unknown) => {
      const uc = createChain({
        eq: () => uc,
        neq: () => uc,
        gt: () => uc,
        gte: () => uc,
        lt: () => uc,
        lte: () => uc,
        like: () => uc,
        ilike: () => uc,
        is: () => uc,
        in: () => uc,
        contains: () => uc,
        containedBy: () => uc,
        or: () => uc,
      }) as any
      uc.select = () => Promise.resolve(resolved)
      return uc
    },
    delete: () => {
      const dc = createChain({
        eq: () => dc,
        neq: () => dc,
        gt: () => dc,
        gte: () => dc,
        lt: () => dc,
        lte: () => dc,
        like: () => dc,
        ilike: () => dc,
        is: () => dc,
        in: () => dc,
        contains: () => dc,
        containedBy: () => dc,
        or: () => dc,
      }) as any
      dc.select = () => Promise.resolve(resolved)
      return dc
    },
  })

  return {
    schema: (schema: string) => ({
      from: (table: string) => from(table),
      rpc: (fn: string, args?: unknown) => Promise.resolve(resolved),
    }),
    functions: {
      invoke: (name: string, opts?: unknown) => Promise.resolve(resolved),
    },
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, body: unknown, opts?: unknown) =>
          Promise.resolve({ data: { path }, error: null }),
        download: (path: string) =>
          Promise.resolve({ data: new Blob(), error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
        remove: (paths: string[]) => Promise.resolve({ data: null, error: null }),
        createSignedUrl: () =>
          Promise.resolve({ data: { signedUrl: "https://signed.url" }, error: null }),
      }),
      vectors: {
        from: (bucket: string) => ({
          index: (name: string) => ({
            queryVectors: (opts: unknown) => Promise.resolve(resolved),
          }),
        }),
      },
    },
  }
}
