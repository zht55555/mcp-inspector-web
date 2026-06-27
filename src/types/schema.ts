export type FieldType = "string" | "number" | "boolean" | "enum" | "object" | "array" | "json";

export interface SchemaProperty {
  type?: string;
  description?: string;
  enum?: string[];
  minimum?: number;
  maximum?: number;
  pattern?: string;
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
}

export interface JsonSchemaLike {
  type?: string;
  required?: string[];
  properties?: Record<string, SchemaProperty>;
}

export interface FieldRules {
  required: boolean;
  minimum?: number;
  maximum?: number;
  pattern?: string;
}

export interface ParsedField {
  key: string;
  label: string;
  description?: string;
  type: FieldType;
  options?: string[];
  rules: FieldRules;
}

export type FormValue = string | number | boolean;
export type FormValueMap = Record<string, FormValue>;
export type FormErrorMap = Record<string, string>;
