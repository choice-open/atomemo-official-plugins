# Resource Mapper

`resource_mapper` lets users map a remote resource schema to custom values. It supports:

- **manual mode**: one typed input per field
- **auto mode**: JSON editor with expression support

## Property Definition

```typescript
interface PropertyResourceMapper extends PropertyBase {
  type: "resource_mapper"
  mapping_method: string
  default?: ResourceMapperValue | null
}
```

## Runtime Value

```typescript
interface ResourceMapperValue {
  __type__: "resource_mapper"
  mapping_mode: "manual" | "auto"
  value: Record<string, unknown> | string | null
}
```

## `resource_mapping` Callback

```typescript
type ToolResourceMappingFunction = (input: {
  args: {
    parameters: Record<string, unknown>
    credentials: Record<string, InputArgsCredential>
  }
}) => Promise<{
  fields: Array<{
    id: string
    display_name?: I18nText | null
    type: "string" | "number" | "integer" | "boolean" | "object" | "array"
    required?: boolean | null
  }>
  empty_fields_notice?: I18nText | null
}>
```

## Helper Function

Use `extractResourceMapper()` from the SDK to safely extract the mapped object value.
