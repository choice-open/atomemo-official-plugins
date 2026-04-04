# Edit Image Tool

## Tool

- **Name**: `edit-image`
- **Purpose**: Edit an existing image using a text prompt with Google Gemini's native image generation (Nano Banana).

## Parameters

| Name                      | Type            | Required | UI Component        | Description                                                                                                                                               | Example                            |
| ------------------------- | --------------- | -------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `credentialId`            | `credential_id` | `true`   | `credential-select` | Gemini API key credential.                                                                                                                                | —                                  |
| `model`                   | `string`        | `true`   | `select`            | Nano Banana model to use. Default: `gemini-3.1-flash-image-preview`.                                                                                      | `"gemini-3.1-flash-image-preview"` |
| `aspect_ratio`            | `string`        | `false`  | `select`            | Aspect ratio of the output image. Default: `1:1`.                                                                                                         | `"16:9"`                           |
| `resolution`              | `string`        | `false`  | `select`            | Output resolution. Options: `512`, `1K`, `2K`, `4K`. Default: `1K`.                                                                                       | `"2K"`                             |
| `thinking_level`          | `string`        | `false`  | `select`            | Thinking level: `minimal` (faster) or `high` (better quality). Default: `minimal`.                                                                        | `"high"`                           |
| `include_thoughts`        | `boolean`       | `false`  | `switch`            | Return the model's thought summary in the response. This only affects visibility; thinking tokens may still be billed even when hidden. Default: `false`. | `true`                             |
| `enable_search_grounding` | `boolean`       | `false`  | `switch`            | Enable Google Search for real-time data. Default: `false`.                                                                                                | `true`                             |
| `upload_to_storage`       | `boolean`       | `false`  | `switch`            | Upload result to persistent storage. Default: `true`.                                                                                                     | `false`                            |
| `prompt`                  | `string`        | `true`   | `textarea`          | Text description of the edits to make to the image.                                                                                                       | `"Add a wizard hat on the cat"`    |
| `image`                   | `file_ref`      | `true`   | `input`             | The source image to edit. Supports JPEG, PNG, GIF, WebP.                                                                                                  | —                                  |

## Tool Input Example

```json
{
  "aspect_ratio": "1:1",
  "credentialId": "019d512c-54ea-7579-a7c8-6ec05b8257ef",
  "enable_search_grounding": false,
  "image": {
    "size": 1809919,
    "filename": "nano-banana-1775184733116.png",
    "extension": ".png",
    "source": "oss",
    "content": null,
    "__type__": "file_ref",
    "res_key": "plugin-uploads/nano-banana__debug__dev/a5c9409c-f149-4b32-8de8-66a6e2cb135c/.png",
    "remote_url": null,
    "mime_type": "image/png"
  },
  "include_thoughts": false,
  "model": "gemini-2.5-flash-image",
  "prompt": "add a dog beside the cats",
  "resolution": "1K",
  "thinking_level": "minimal",
  "upload_to_storage": true
}
```

## Tool Output Example

```json
{
  "text": "Sure, here's the updated image: ",
  "thoughts": null,
  "image": {
    "__type__": "file_ref",
    "source": "oss",
    "filename": "nano-banana-edit-1775184757030.png",
    "extension": ".png",
    "mime_type": "image/png",
    "size": 2699224,
    "res_key": "plugin-uploads/nano-banana/7900dc9e-f073-4561-bfc6-c8d6d8766774/.png",
    "remote_url": null,
    "content": null
  },
  "model": "gemini-2.5-flash-image",
  "grounding_sources": null
}
```

## Editing Capabilities

- **Add elements**: "Add a small wizard hat on the cat's head"
- **Remove elements**: "Remove the person in the background"
- **Modify elements**: "Change the blue sofa to brown leather"
- **Style transfer**: "Make this photo look like a watercolor painting"
- **Color grading**: "Apply warm, golden hour lighting to this scene"
- **Inpainting (semantic)**: "Change only the sky to a dramatic sunset"

## Limitations

- Only one input image per request (multi-image composition requires Vertex AI).
- No mask-based inpainting — the model uses semantic understanding to determine edit regions.
- No image upscaling (requires Vertex AI `upscaleImage()` API).
- Each edit is a single turn — no multi-turn iterative refinement.
- The model may alter other parts of the image slightly to maintain consistency.
- `include_thoughts` only controls whether thought summaries are returned. It does not disable thinking token usage or billing.
