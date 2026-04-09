# Tavily Research Tool

## Tool

- **Name**: `tavily-research`
- **Purpose**: Run Tavily Research (`POST /research`) to generate a comprehensive research report.

## Parameters

- **Tavily Credential**: select the stored `tavily` API key credential.
- **`input`**: the research question/topic.
- **`model`**: `mini` | `pro` | `auto`.
- **`citation_format`**: `numbered` | `mla` | `apa` | `chicago`.
- **`output_schema_json`**: optional JSON Schema (as a JSON string) to shape the output.

An optional `advanced_options_json` lets you pass extra Tavily `/research` fields as a JSON object.

