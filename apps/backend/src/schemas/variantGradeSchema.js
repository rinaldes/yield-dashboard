export const variantGradeSchema = {
  body: {
    type: "object",
    required: ["variant_id", "grade_id"],
    properties: {
      variant_id: { type: "number", minimum: 1 },
      grade_id: { type: "number", minimum: 1 },
      is_active: { type: "boolean", default: true },
    },
  },
};
