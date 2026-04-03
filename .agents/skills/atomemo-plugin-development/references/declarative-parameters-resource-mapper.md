# Resource Mapper

`PropertyResourceMapper` lets users map a remote resource's field schema to custom
values. It supports two modes:

- **manual mode**: a dynamic form where each field gets a typed input
- **auto mode**: a JSON editor with expression support for programmatic mapping

## Property Definition

```typescript
interface PropertyResourceMapper extends PropertyBase {
  type: "resource_mapper"

  /** Name of the method in resource_mapping used to fetch available fields. */
  mapping_method: string

  /** Default value. */
  default?: ResourceMapperValue | null
}
```

> [!NOTE]
> `resource_mapper` is only supported in **Tool** parameters.

## Runtime Value

```typescript
interface ResourceMapperValue {
  __type__: "resource_mapper"

  /** The mode that was active when this value was set. */
  mapping_mode: "manual" | "auto"

  /**
   * Manual mode: Record<fieldId, fieldValue> — one entry per mapped field.
   * Auto mode: a JSON object or a string.
   */
  value: Record<string, unknown> | string | null
}
```

## `ToolResourceMappingField`

Each field returned by a `resource_mapping` callback uses this structure:

```typescript
interface ToolResourceMappingField {
  /** Unique field identifier, used as the key in the mapped value. */
  id: string

  /** Human-readable label shown in the UI; falls back to id if not set. */
  display_name?: I18nText | null

  /** Field value type — determines which input component is rendered in manual mode. */
  type: "string" | "number" | "integer" | "boolean" | "object" | "array"

  /** Whether the field is required. Required fields cannot be removed in manual mode. */
  required?: boolean | null

  /** Optional field-level hint shown next to the input field in manual mode. */
  ui?: {
    hint?: I18nText | null
  } | null
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
  fields: Array<ToolResourceMappingField>
  empty_fields_notice?: I18nText | null
}>
```

Register the callback in `ToolDefinition.resource_mapping`:

```typescript
const myTool: ToolDefinition = {
  name: "my-tool",
  parameters: [/* ... */],
  resource_mapping: {
    map_record_fields: async ({ args }) => {
      const tableId = extractResourceLocator(args.parameters.table)
      if (!tableId) {
        return {
          fields: [],
          empty_fields_notice: { en_US: "Select a table first." },
        }
      }

      const schema = await apiClient.getTableSchema(tableId)
      return {
        fields: schema.columns.map(col => ({
          id: col.id,
          display_name: { en_US: col.name },
          type: col.dataType,
          required: col.required,
          ui: {
            hint: col.description ? { en_US: col.description } : null,
          },
        })),
      }
    },
  },
}
```

## `depends_on` Cascading

> [!IMPORTANT]
> When the available fields depend on another parameter, always declare
> `depends_on` on the mapper. This makes the UI re-fetch the field schema and
> reset the mapping when the referenced parameter changes.
>
> In the schema, `depends_on` is only supported on `resource_locator` and
> `resource_mapper`. The upstream parameters it references should be `string`,
> `number` / `integer`, `boolean`, or `resource_locator` properties.

```typescript
const fieldsParam: PropertyResourceMapper = {
  name: "fields",
  type: "resource_mapper",
  display_name: { en_US: "Fields" },
  required: true,
  depends_on: ["workspace", "table"],
  mapping_method: "map_record_fields",
}
```

Read upstream parameters from `args.parameters` inside the callback to determine
which schema to query.

## Helper Function

Use `extractResourceMapper()` from the SDK to safely extract the mapped object
value:

```typescript
import { extractResourceMapper } from "@choiceopen/atomemo-plugin-sdk-js"

invoke: async ({ args }) => {
  const fieldValues = extractResourceMapper(args.parameters.fields)
  if (fieldValues) {
    await apiClient.createRecord(fieldValues)
  }
}
```

This returns `Record<string, unknown> | null`. It throws when the value fails
schema validation or when auto mode resolves to a plain string instead of an
object.

## UI Behavior

The field renders as a block with a **mapping mode** selector.

### Manual Mode

1. The UI calls `resource_mapping` on mount and whenever a `depends_on`
   parameter changes.
2. Each field renders as a typed input row:

   | Field type | Input component |
   | ---------- | --------------- |
   | `string` | Text input |
   | `number` / `integer` | Number input |
   | `boolean` | Toggle switch |
   | `object` / `array` | JSON code editor |

3. Required fields cannot be removed.
4. If a field definition includes `ui.hint`, the hint is shown below that
   field's input row.
5. An **Add Field** dropdown lists optional fields that were removed, allowing
   the user to restore them.
6. If no fields are available, the `empty_fields_notice` from the callback is
   displayed.

### Auto Mode

Auto mode renders a JSON code editor with expression input enabled. The user
provides the complete mapping as a JSON object or expression string.
