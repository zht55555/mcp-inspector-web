import type { JsonSchemaLike, ParsedField, SchemaProperty } from "@/types/schema";

function resolveFieldType(property: SchemaProperty): ParsedField["type"] {
  if (property.enum && property.enum.length > 0) {
    return "enum";
  }

  switch (property.type) {
    case "string":
      return "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      return "object";
    case "array":
      return "array";
    default:
      return "json";
  }
}

export function parseSchemaToFields(schema: JsonSchemaLike): ParsedField[] {
  const properties = schema.properties ?? {};
  const requiredSet = new Set(schema.required ?? []);

  return Object.entries(properties).map(([key, property]) => ({
    key,
    label: key,
    description: property.description,
    type: resolveFieldType(property),
    options: property.enum,
    rules: {
      required: requiredSet.has(key),
      minimum: property.minimum,
      maximum: property.maximum,
      pattern: property.pattern,
    },
  }));
}
