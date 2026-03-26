# I18nText — Internationalized Text

All user-facing text in declarative parameters uses `I18nText`:

```typescript
type I18nText = {
  en_US: string
  zh_Hans?: string
  [locale: string]: string
}
```

## Example

```typescript
{
  display_name: {
    en_US: "API Key",
    zh_Hans: "API 密钥",
  }
}
```

## Rule

`en_US` is always required. If the current locale is missing, Atomemo falls back to `en_US`.

In production plugin code, prefer the `t()` helper over inline objects so translations stay centralized.
