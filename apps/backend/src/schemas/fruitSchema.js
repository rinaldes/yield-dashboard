export const fruitSchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", minLength: 1, maxLength: 255 },
      description: { type: "string", maxLength: 500 },
      is_active: { type: "boolean", default: true },
    },
  },
};
