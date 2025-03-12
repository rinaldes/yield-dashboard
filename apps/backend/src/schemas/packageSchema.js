// schemas/packageSchema.js
export const packageSchema = {
  body: {
    type: "object",
    required: ["name", "variant_id"],
    properties: {
      name: { type: "string", minLength: 1, maxLength: 255 },
      variant_id: { type: "number", minimum: 1 },
      description: { type: "string", maxLength: 500 },
      is_active: { type: "boolean", default: true },
    },
  },
};
