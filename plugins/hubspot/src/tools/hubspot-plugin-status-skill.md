# HubSpot Plugin Status Tool

## Tool

- **Name**: `hubspot-plugin-status`
- **Purpose**: Returns stable scaffold metadata for the current HubSpot starter plugin. This tool exists only to verify plugin wiring and document planned scope.

## Parameters

This tool takes no parameters.

## Tool Input Example

```json
{
  "parameters": {}
}
```

## Tool Output Example

```json
{
  "status": "scaffold_only",
  "plugin": "hubspot",
  "credentials_configured": false,
  "planned_resources": [
    "contact",
    "company",
    "contactList",
    "deal",
    "engagement",
    "ticket"
  ],
  "planned_auth": [
    "oauth2",
    "private_app_token"
  ],
  "note": "No real HubSpot operations are implemented yet."
}
```
