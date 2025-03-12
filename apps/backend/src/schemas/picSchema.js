export const picSchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
      is_active: {
        type: "boolean",
        default: true,
      },
    },
  },
};
