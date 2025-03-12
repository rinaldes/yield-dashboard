export const yieldSchema = {
  body: {
    type: "object",
    required: ["harvest_id"],
    properties: {
      harvest_id: { type: "number", minimum: 1 },
    },
  },
};
