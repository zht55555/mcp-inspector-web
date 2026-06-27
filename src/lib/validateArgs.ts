import type { FormErrorMap, FormValueMap, ParsedField } from "@/types/schema";

function isEmptyValue(value: FormValueMap[string] | undefined) {
  return value === undefined || value === "";
}

export function validateFormValues(fields: ParsedField[], values: FormValueMap): FormErrorMap {
  const errors: FormErrorMap = {};

  for (const field of fields) {
    const value = values[field.key];

    if (field.rules.required && isEmptyValue(value)) {
      errors[field.key] = "validation.required";
      continue;
    }

    if (isEmptyValue(value)) {
      continue;
    }

    if (field.type === "number") {
      const numericValue = Number(value);
      if (Number.isNaN(numericValue)) {
        errors[field.key] = "validation.number";
        continue;
      }
      if (field.rules.minimum !== undefined && numericValue < field.rules.minimum) {
        errors[field.key] = "validation.minimum";
        continue;
      }
      if (field.rules.maximum !== undefined && numericValue > field.rules.maximum) {
        errors[field.key] = "validation.maximum";
        continue;
      }
    }

    if (field.rules.pattern && typeof value === "string") {
      const regex = new RegExp(field.rules.pattern);
      if (!regex.test(value)) {
        errors[field.key] = "validation.pattern";
        continue;
      }
    }

    if (field.type === "object" || field.type === "array" || field.type === "json") {
      if (typeof value !== "string") {
        errors[field.key] = "validation.json";
        continue;
      }
      try {
        JSON.parse(value);
      } catch {
        errors[field.key] = "validation.json";
      }
    }
  }

  return errors;
}
