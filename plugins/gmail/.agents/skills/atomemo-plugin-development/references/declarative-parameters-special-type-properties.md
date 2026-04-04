# Special Type Properties

## PropertyCredentialId

References a pre-configured credential.

```typescript
interface PropertyCredentialId extends PropertyBase {
  type: "credential_id"
  credential_name: string
  ui?: PropertyUICredentialId
}
```

## PropertyEncryptedString

Stores sensitive values in encrypted form.

```typescript
interface PropertyEncryptedString extends PropertyBase {
  type: "encrypted_string"
}
```

## PropertyFileReference

Represents a file managed by Atomemo's file system.

```typescript
interface PropertyFileReference extends PropertyBase {
  type: "file_ref"
}
```

At runtime, treat file references as opaque values and resolve them via `context.files`.

## Example

```typescript
{
  name: "file",
  type: "file_ref",
  required: true,
  display_name: { en_US: "File" },
}
```
