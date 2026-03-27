import type { ToolResourceMappingField } from "@choiceopen/atomemo-plugin-sdk-js/types"

export function mapAirtableFieldType(
  fieldType: string,
): ToolResourceMappingField["type"] {
  switch (fieldType) {
    case "barcode":
    case "createdBy":
    case "lastModifiedBy":
    case "singleCollaborator":
      return "object"
    case "checkbox":
      return "boolean"
    case "count":
      return "integer"
    case "currency":
    case "number":
    case "percent":
    case "rating":
      return "number"
    case "lookup":
    case "multipleAttachments":
    case "multipleCollaborators":
    case "multipleLookupValues":
    case "multipleRecordLinks":
    case "multipleSelects":
      return "array"
    default:
      return "string"
  }
}
