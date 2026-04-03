# PropertyBase — Common Base Fields

All property types share these base fields:

```typescript
interface PropertyBase {
  name: string
  display_name?: I18nText
  required?: boolean
  display?: {
    show?: DisplayCondition
    hide?: DisplayCondition
  }
  ai?: {
    llm_description?: I18nText
  }
  ui?: PropertyUI
}
```

## Field Details

| Field | Required | Description |
| ----- | -------- | ----------- |
| `name` | ✅ | Parameter identifier. Uses letters, digits, and underscores |
| `display_name` | ❌ | Label shown in the UI |
| `required` | ❌ | Marks the field as required |
| `display` | ❌ | Conditional show/hide rules |
| `ai` | ❌ | Extra hints for LLM-assisted filling |
| `ui` | ❌ | Rendering configuration |

See `declarative-parameters-display-condition.md` for conditional visibility details.
