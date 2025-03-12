export const locationSchema = {
  body: {
    type: "object",
    required: ["name", "is_indoors"],
    properties: {
      name: { type: "string", minLength: 1, maxLength: 255 },
      is_indoors: { type: "boolean" },
      description: { type: "string", maxLength: 500 },
      total_plants: { type: "number", minimum: 0 },
      planting_date: { type: "string", format: "date-time" },
      width: { type: "number", minimum: 0 },
      height: { type: "number", minimum: 0 },
      length: { type: "number", minimum: 0 },
      area: { type: "number", minimum: 0 },
    },
  },
};
