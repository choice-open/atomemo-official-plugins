# Resource Locator

`resource_locator` lets users select a remote resource through one of three modes:

- list
- url
- id

## Property Definition

```typescript
interface PropertyResourceLocator extends PropertyBase {
  type: "resource_locator"
  modes: Array<ResourceLocatorMode>
  default?: ResourceLocatorValue | null
}
```

## Mode Types

### `"list"`

```typescript
{
  type: "list",
  display_name?: I18nText | null,
  placeholder?: I18nText | null,
  search_list_method: string,
  searchable?: boolean | null,
}
```

### `"url"`

```typescript
{
  type: "url",
  display_name?: I18nText | null,
  placeholder?: I18nText | null,
  extract_value: {
    type: "regex",
    regex: string,
  },
}
```

### `"id"`

```typescript
{
  type: "id",
  display_name?: I18nText | null,
  placeholder?: I18nText | null,
}
```

## Runtime Value

```typescript
interface ResourceLocatorValue {
  __type__: "resource_locator"
  mode_name: "list" | "url" | "id"
  value: string | null
  cached_result_label?: string | null
  cached_result_url?: string | null
}
```

## `locator_list` Callback

```typescript
type ToolLocatorListFunction = (input: {
  parameters: Record<string, unknown>
  credentials: Record<string, InputArgsCredential>
  filter?: string | null
  pagination_token?: string | null
}) => Promise<{
  results: {
    label: string
    value: string
    url?: string | null
  }[]
  pagination_token?: string | null
}>
```

## Helper Function

Use `extractResourceLocator()` from the SDK to read the plain string value safely.
