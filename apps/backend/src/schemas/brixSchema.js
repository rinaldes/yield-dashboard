export const brixSchema = {
  body: {
    type: "object",
    required: ["location_id", "brix_score"],
    properties: {
      location_id: {
        type: "integer",
        minimum: 1,
      },
      from: {
        type: "string",
        enum: ["market", "reject", "none"],
        default: "none",
      },
      type: {
        type: "string",
        enum: ["tip", "deep", "all"],
        nullable: true,
      },
      brix_score: {
        type: "number",
        minimum: 0,
        maximum: 100,
      },
      is_active: {
        type: "boolean",
        default: true,
      },
    },
  },
};
