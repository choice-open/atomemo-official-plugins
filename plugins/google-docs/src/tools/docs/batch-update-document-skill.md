# Batch Update Document Tool Documentation

## Tool

- **Name**: `batch-update-document`
- **Purpose**: Applies one or more Google Docs update requests atomically.

## UI visibility

Optional fields use Atomemo `display` conditions on sibling `operation`:

- **raw_json** (default): shows `requests_json` only; structured fields stay hidden.
- **insert_text**: shows `insert_text`, `insert_index`.
- **replace_all_text**: shows `replace_contains_text`, `replace_text`.
- **update_text_style**: shows `style_start_index`, `style_end_index`, `style_bold`.
- **write_control_json** is always visible (applies to any mode).

## Parameters

| Name                 | Type            | Required | UI Component      | Description                                                                             | Example                                                                |
| -------------------- | --------------- | -------- | ----------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `google_credential`  | `credential_id` | `true`   | credential picker | Google OAuth2 credential bound to `google-docs-oauth2`.                                 | `"google_credential"`                                                  |
| `document_id`        | `string`        | `true`   | `input`           | Target document ID.                                                                     | `"1AbCdEfGhIjKlMnOp"`                                                  |
| `operation`          | `string`        | `true`   | `select`          | Request build mode: `raw_json`, `insert_text`, `replace_all_text`, `update_text_style`. | `"insert_text"`                                                        |
| `requests_json`      | `string`        | `false`  | `textarea`        | Raw JSON array of Docs requests when `operation=raw_json`.                              | `"[{\"insertText\":{\"location\":{\"index\":1},\"text\":\"Hello\"}}]"` |
| `write_control_json` | `string`        | `false`  | `textarea`        | Optional write control JSON object (`requiredRevisionId` / `targetRevisionId`).         | `"{\"requiredRevisionId\":\"AAABBB\"}"`                                |

## Structured mode notes

Structured helpers only send a subset of API features (no `tabId` on `insert_text`, etc.). Use **`operation: "raw_json"`** for tabs, tables, lists, named ranges, inline images, and combined multi-step edits.

### insert_text

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "document_id": "1AbCdEfGhIjKlMnOp",
    "operation": "insert_text",
    "insert_text": "Hello Atomemo",
    "insert_index": 1
  }
}
```

### replace_all_text

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "document_id": "1AbCdEfGhIjKlMnOp",
    "operation": "replace_all_text",
    "replace_contains_text": "{{name}}",
    "replace_text": "Leo"
  }
}
```

### update_text_style

The tool fixes `fields` to `"bold"` and only toggles **bold**. For fonts, colors, italic, etc., use **raw JSON** `updateTextStyle` with a broader `fields` mask (see below).

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "document_id": "1AbCdEfGhIjKlMnOp",
    "operation": "update_text_style",
    "style_start_index": 10,
    "style_end_index": 20,
    "style_bold": true
  }
}
```

## Raw JSON mode

`requests_json` must be a **JSON array** of objects, each with exactly one request key (e.g. `insertText`, `deleteContentRange`). Pass it as a **string** (escape inner double quotes in JSON payloads).

### Indices and tabs

- Indices are **UTF-16 code units**, start at **1** for body content in API examples; always confirm ranges with **`get-document`** on the same revision you edit.
- **`tabId`**: omit → first tab; in multi-tab docs, set `tabId` on `location`, `range`, or types that support it (see API reference). Tab IDs come from the document JSON (`tabs` / `documentTab`).
- **`segmentId`**: usually empty for body; use header/footer/footnote IDs when editing those segments.

### Write control and suggestions

- **`write_control_json`**: optional JSON matching Docs `WriteControl`:
  - **`requiredRevisionId`**: apply only if the document is still at this revision; otherwise **400** (strict, good for “no stale write”).
  - **`targetRevisionId`**: merge your edits on top of collaborator changes since that revision (see API docs for staleness limits).
- **Suggestions**: there is **no** `batchUpdate` request to accept/reject suggestions like the Docs UI. Workflow:
  1. **`get-document`** with `suggestions_view_mode`: **`SUGGESTIONS_INLINE`** (per API: edits should be based on a document loaded in this mode).
  2. Inspect suggested ranges / IDs in the response.
  3. **Re-apply** the intended final content yourself (e.g. `deleteContentRange`, `insertText`, `updateTextStyle`)—most “suggestion handling” is manual replication of the desired end state.

---

## Raw JSON examples (`requests` arrays)

Below, each block is the **parsed** `requests` array. Stringify it and assign to `requests_json`.

### Tabs

Add a tab (response includes the new tab id in `replies` for `addDocumentTab`):

```json
[
  {
    "addDocumentTab": {
      "tabProperties": { "title": "Appendix" }
    }
  }
]
```

Use the tab id returned in **`replies[].addDocumentTab.tabProperties.tabId`** (or read `tabs` from **`get-document`** with `include_tabs_content`).

Insert body text in a **specific** tab (`TAB_ID` from `get-document`):

```json
[
  {
    "insertText": {
      "location": { "index": 1, "tabId": "TAB_ID" },
      "text": "Section for tab B\n"
    }
  }
]
```

`replaceAllText` limited to certain tabs:

```json
[
  {
    "replaceAllText": {
      "containsText": { "text": "TODO", "matchCase": false },
      "replaceText": "DONE",
      "tabsCriteria": { "tabIds": ["TAB_ID_A", "TAB_ID_B"] }
    }
  }
]
```

### Insert, delete, and move text

Insert and delete (moving is **two steps**: insert at target, then delete source—recalculate indices after each step, or batch carefully in one `batchUpdate` in **reverse index order** when deleting before insert would invalidate ranges):

```json
[
  {
    "insertText": {
      "location": { "index": 50, "tabId": "TAB_ID" },
      "text": "Inserted paragraph.\n"
    }
  },
  {
    "deleteContentRange": {
      "range": { "startIndex": 100, "endIndex": 120, "tabId": "TAB_ID" }
    }
  }
]
```

**Move pattern (conceptual):** (1) Read substring indices from `get-document`. (2) `insertText` the same text at the new index. (3) `deleteContentRange` on the old range—if the delete is _before_ the insert position in the document, indices shift: prefer computing final ranges from a single plan or a second `get-document` pass.

### Merge table cells

```json
[
  {
    "mergeTableCells": {
      "tableRange": {
        "tableCellLocation": {
          "tableStartLocation": { "index": TABLE_START_INDEX, "tabId": "TAB_ID" },
          "rowIndex": 0,
          "columnIndex": 0
        },
        "rowSpan": 1,
        "columnSpan": 2
      }
    }
  }
]
```

### Text style and field mask (`fields`)

`fields` is a comma-separated list of `textStyle` leaf fields to update; use `"*"` to mean all fields you set on `textStyle`. To **reset** a property, include its name in `fields` and omit or clear that property per API rules.

```json
[
  {
    "updateTextStyle": {
      "range": { "startIndex": 5, "endIndex": 25, "tabId": "TAB_ID" },
      "textStyle": {
        "bold": true,
        "italic": true,
        "underline": true,
        "foregroundColor": {
          "color": { "rgbColor": { "red": 0.8, "green": 0.1, "blue": 0.1 } }
        },
        "weightedFontFamily": { "fontFamily": "Roboto", "weight": 400 },
        "fontSize": { "magnitude": 14, "unit": "PT" }
      },
      "fields": "bold,italic,underline,foregroundColor,weightedFontFamily,fontSize"
    }
  }
]
```

### Inline image

`uri` must be **publicly readable**, ≤ **2 KB** string length, PNG/JPEG/GIF; image limits per API (size / megapixels). Insert **inside** a paragraph’s content range, not at raw table boundaries.

```json
[
  {
    "insertInlineImage": {
      "location": { "index": 42, "tabId": "TAB_ID" },
      "uri": "https://www.gstatic.com/images/branding/product/2x/docs_96dp.png",
      "objectSize": {
        "height": { "magnitude": 120, "unit": "PT" }
      }
    }
  }
]
```

### Lists (bullets / numbering)

Create bullets for paragraphs overlapping a range (preset examples include `BULLET_DISC_CIRCLE_SQUARE`, `BULLET_ARROW_DIAMOND_DISC`, `NUMBERED_DECIMAL_ALPHA_ROMAN`, etc.—see official preset list):

```json
[
  {
    "createParagraphBullets": {
      "range": { "startIndex": 10, "endIndex": 200, "tabId": "TAB_ID" },
      "bulletPreset": "BULLET_DISC_CIRCLE_SQUARE"
    }
  }
]
```

Remove list styling (keeps visual indent):

```json
[
  {
    "deleteParagraphBullets": {
      "range": { "startIndex": 10, "endIndex": 200, "tabId": "TAB_ID" }
    }
  }
]
```

### Tables

Insert a 3×2 table (a newline is inserted before the table; table start is typically at `location.index + 1`):

```json
[
  {
    "insertTable": {
      "location": { "index": 1, "tabId": "TAB_ID" },
      "rows": 3,
      "columns": 2
    }
  }
]
```

Insert row below / above a reference cell:

```json
[
  {
    "insertTableRow": {
      "tableCellLocation": {
        "tableStartLocation": { "index": TABLE_START_INDEX, "tabId": "TAB_ID" },
        "rowIndex": 1,
        "columnIndex": 0
      },
      "insertBelow": true
    }
  }
]
```

Insert column to the right of a reference cell:

```json
[
  {
    "insertTableColumn": {
      "tableCellLocation": {
        "tableStartLocation": { "index": TABLE_START_INDEX, "tabId": "TAB_ID" },
        "rowIndex": 0,
        "columnIndex": 1
      },
      "insertRight": true
    }
  }
]
```

Pin header rows:

```json
[
  {
    "pinTableHeaderRows": {
      "tableStartLocation": { "index": TABLE_START_INDEX, "tabId": "TAB_ID" },
      "pinnedHeaderRowsCount": 1
    }
  }
]
```

### Named ranges

Create from explicit body range:

```json
[
  {
    "createNamedRange": {
      "name": "price_field",
      "range": { "startIndex": 30, "endIndex": 40, "tabId": "TAB_ID" }
    }
  }
]
```

Replace content for a named range (by id from `createNamedRange` reply or document `namedRanges`):

```json
[
  {
    "replaceNamedRangeContent": {
      "namedRangeId": "NAMED_RANGE_ID",
      "text": "$42.00"
    }
  }
]
```

Or by **name** (all matching names; discontinuous ranges have API-specific behavior—see `ReplaceNamedRangeContent` docs):

```json
[
  {
    "replaceNamedRangeContent": {
      "namedRangeName": "price_field",
      "text": "$99.00",
      "tabsCriteria": { "tabIds": ["TAB_ID"] }
    }
  }
]
```

Delete by id or name:

```json
[{ "deleteNamedRange": { "namedRangeId": "NAMED_RANGE_ID" } }]
```

---

## Full tool call (raw JSON + write control)

```json
{
  "parameters": {
    "google_credential": "google_credential",
    "document_id": "1AbCdEfGhIjKlMnOp",
    "operation": "raw_json",
    "requests_json": "[{\"insertText\":{\"location\":{\"index\":1,\"tabId\":\"TAB_ID\"},\"text\":\"Hi\\n\"}}]",
    "write_control_json": "{\"requiredRevisionId\":\"AAA...current from get-document...\"}"
  }
}
```
