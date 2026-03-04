# Supabase RPC 使用说明与范例

本文档说明如何使用插件中的 **supabase-rpc** 工具调用 Supabase/Postgres 中的存储过程（RPC）。

---

## 1. 工具说明

| 项目 | 说明 |
|------|------|
| **工具名** | supabase-rpc |
| **作用** | 调用指定 schema 下的 Postgres 函数（RPC），可传入可选参数。 |
| **对应客户端 API** | `supabase.schema(schema).rpc(functionName, args)` |

---

## 2. 参数说明

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| **supabase_credential** | credential_id | 是 | — | 使用本插件的 **supabase-connection** 凭证 ID。 |
| **function_name** | string | 是 | — | 要调用的 Postgres 函数名（如 `get_user_count`、`e2e_echo`）。 |
| **args** | string | 否 | — | 函数参数的 **JSON 对象字符串**。不传或传空字符串/空对象时，RPC 将以无参数形式调用。 |
| **schema** | string | 否 | `public` | 函数所在 schema。非 `public` 时需显式指定（如 `private`、`extensions`）。 |

**返回值**（工具统一格式）：

- `success`: boolean — 是否调用成功  
- `data`: 函数返回值（单值、对象或数组，由函数定义决定）  
- `error`: string | null — 失败时的错误信息  
- `code`: string | null — 失败时的 PostgREST 错误码（若有）  

---

## 3. args 规则

- **格式**：必须是合法 JSON 对象字符串，键为参数名，值为参数值。  
- **不传 / 空字符串**：等价于无参调用，内部传 `undefined`。  
- **空对象 `{}`**：同样等价于无参调用。  
- **无效 JSON**：会被当作空对象处理，即无参调用（不会抛错）。  
- 参数名、类型、顺序需与你在 Postgres 中定义的函数一致。

---

## 4. 在 Supabase 中创建 RPC 函数

调用前需在 Supabase 的 **SQL Editor** 中先创建好函数。下面是两个常用范例，可直接复制执行。

### 4.1 无参函数：返回数量

```sql
-- 返回符合条件的记录数（示例：表 e2e_test 中 name 以 'e2e-' 开头的行数）
create or replace function public.get_e2e_test_count()
returns bigint
language sql
security definer
as $$
  select count(*)::bigint from public.e2e_test where name like 'e2e-%';
$$;
```

### 4.2 带参函数：回显字符串

```sql
-- 接收一个 text 参数并原样返回（常用于测试或简单 RPC 范例）
create or replace function public.e2e_echo(val text)
returns text
language sql
as $$
  select val;
$$;
```

### 4.3 带多参数：根据用户 ID 查询

```sql
-- 示例：根据 user_id 返回该用户的统计信息
create or replace function public.get_user_stats(p_user_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'user_id', p_user_id,
    'order_count', (select count(*) from orders where user_id = p_user_id),
    'total_amount', (select coalesce(sum(amount), 0) from orders where user_id = p_user_id)
  ) into result;
  return result;
end;
$$;
```

---

## 5. 在 Atomemo 中的使用范例

以下示例假设已配置好 **supabase-connection** 凭证，凭证 ID 为 `my_supabase`。

### 5.1 调用无参函数 `get_e2e_test_count`

- **function_name**：`get_e2e_test_count`  
- **args**：留空或 `{}`  
- **schema**：`public`（默认可不填）

工具返回的 `data` 为数字（bigint），表示满足条件的行数。

### 5.2 调用带单参函数 `e2e_echo`

- **function_name**：`e2e_echo`  
- **args**：`{"val": "e2e-rpc-hello"}`  
- **schema**：`public`

工具返回的 `data` 为字符串 `e2e-rpc-hello`。

### 5.3 调用多参函数 `get_user_stats`

- **function_name**：`get_user_stats`  
- **args**：`{"p_user_id": "550e8400-e29b-41d4-a716-446655440000"}`  
- **schema**：`public`

工具返回的 `data` 为 JSON 对象（如 `{ "user_id": "...", "order_count": 5, "total_amount": 100 }`）。

### 5.4 函数在非 public schema 时

若函数创建在例如 `private` schema：

```sql
create or replace function private.my_internal_func(msg text) returns text ...
```

则在工具中填写：

- **function_name**：`my_internal_func`  
- **args**：`{"msg": "hello"}`  
- **schema**：`private`

---

## 6. 常见问题

- **函数不存在 / 未找到**：检查 `function_name` 与 `schema` 是否与 Supabase 中一致；anon key 时需 RLS 或 `security definer` 允许执行。  
- **参数类型错误**：Postgres 函数参数类型（uuid、text、int、jsonb 等）需与 `args` 中传入的类型匹配；UUID 建议传字符串。  
- **返回多行**：若函数返回 `setof` 或表类型，`data` 会是数组；单行单列则为单值。  
- **权限**：使用 anon key 时，若函数在非 public schema 或需要更高权限，可把函数设为 `security definer` 并在函数内做好权限控制。

---

*本文档对应插件工具：supabase-rpc（`src/tools/db/supabase-rpc.ts`）。*
