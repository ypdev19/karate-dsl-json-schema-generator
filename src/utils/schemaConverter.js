/**
 * Checks if value is a plain object
 */
export function isPlainObject(obj) {
  return obj !== null &&
    typeof obj === "object" &&
    Object.getPrototypeOf(obj) === Object.prototype;
}

/**
 * Detect primitive type and return Karate matcher
 */
function getKarateMatcher(value, isRequired) {
  const prefix = isRequired ? "#" : "##";

  if (typeof value === "string") return `${prefix}string`;
  if (typeof value === "number") return `${prefix}number`;
  if (typeof value === "boolean") return `${prefix}boolean`;

  return `${prefix}string`;
}

/**
 * Convert comma-separated required fields string into Set
 */
export function parseRequiredFields(requiredFieldsInput = "") {
  if (!requiredFieldsInput.trim()) {
    return null; // null = all required
  }

  return new Set(
    requiredFieldsInput
      .split(",")
      .map(f => f.trim())
      .filter(Boolean)
  );
}

/**
 * Main recursive converter
 */
export function convertToKarateSchema(
  json,
  requiredFieldsSet = null,
  parentPath = ""
) {
  // ARRAY
  if (Array.isArray(json)) {
    if (json.length === 0) {
      return "#array";
    }

    const firstItem = json[0];

    // array of primitives
    if (!isPlainObject(firstItem) && !Array.isArray(firstItem)) {
      const matcher = getKarateMatcher(firstItem, true).replace("##", "#");
      return `#[] ${matcher}`;
    }

    // array of objects or arrays
    const nested = convertToKarateSchema(
      firstItem,
      requiredFieldsSet,
      parentPath
    );

    // If nested is already a string, use it directly
    if (typeof nested === "string") {
      return `#[] ${nested}`;
    }

    // If nested is an object, stringify it
    return `#[] ${JSON.stringify(nested)}`;
  }

  // OBJECT
  if (isPlainObject(json)) {
    const result = {};

    Object.keys(json).forEach(key => {
      const value = json[key];

      const fullPath = parentPath
        ? `${parentPath}.${key}`
        : key;

      const isRequired =
        requiredFieldsSet === null ||
        requiredFieldsSet.has(key) ||
        requiredFieldsSet.has(fullPath);

      // nested object
      if (isPlainObject(value)) {
        result[key] = convertToKarateSchema(
          value,
          requiredFieldsSet,
          fullPath
        );
        return;
      }

      // array
      if (Array.isArray(value)) {
        result[key] = convertToKarateSchema(
          value,
          requiredFieldsSet,
          fullPath
        );
        return;
      }

      // primitive
      result[key] = getKarateMatcher(value, isRequired);
    });

    return result;
  }

  // primitive fallback
  return getKarateMatcher(json, true);
}

/**
 * Public API used by App.jsx
 */
export function generateKarateSchema(jsonData, requiredFieldsInput = "") {
  const requiredFieldsSet = parseRequiredFields(requiredFieldsInput);

  const schema = convertToKarateSchema(
    jsonData,
    requiredFieldsSet
  );

  // IMPORTANT:
  // ensures valid JSON output with quotes
  return JSON.stringify(schema, null, 2);
}

/**
 * Generates a Karate DSL snippet from the schema JSON string
 */
export function generateKarateSnippet(schemaJsonString) {
  if (!schemaJsonString || typeof schemaJsonString !== "string") {
    return '';
  }
  
  try {
    const schemaObj = JSON.parse(schemaJsonString);
    
    // Convert JSON string to Karate object literal format
    // Remove quotes from keys, keep quotes around values (e.g., "#number")
    const formattedSchema = JSON.stringify(schemaObj, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/: "([^"]+)"/g, ': "$1"');

    return `def schema = ${formattedSchema}\n* match response == schema`;
  } catch (e) {
    console.error('Error generating Karate snippet:', e);
    return '// Error generating snippet';
  }
}