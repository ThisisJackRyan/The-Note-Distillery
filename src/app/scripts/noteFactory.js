const noteTemplate = {
  id: "",
  name: "",
  source: "",
  tags: "",
  summary: "",
  content: "",
  dateCreated: "",
};

export default function noteFactory() {
  return { ...noteTemplate };
}

export function validateNote(toValidate) {
  if (toValidate == null) {
    throw new Error("The note to validate is null or undefined.");
  }

  if (typeof toValidate !== "object" || Array.isArray(toValidate)) {
    throw new Error("The note to validate must be an object.");
  }

  const requiredFields = Object.keys(noteTemplate);
  for (const field of requiredFields) {
    if (!Object.hasOwn(toValidate, field)) {
      throw new Error(`The note is missing the required field: ${field}`);
    }
  }
}
