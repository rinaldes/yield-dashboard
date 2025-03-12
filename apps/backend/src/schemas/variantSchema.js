export const variantSchema = {
  body: {
    type: "object",
    required: ["name", "fruit_id"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
      fruit_id: {
        type: "number",
        minimum: 1,
      },
      description: {
        type: "string",
        maxLength: 500,
      },
      is_active: {
        type: "boolean",
        default: true,
      },
    },
  },
};
