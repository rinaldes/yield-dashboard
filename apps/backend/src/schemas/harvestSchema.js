export const harvestSchema = {
  body: {
    type: "object",
    required: [
      "datetime",
      "location_id",
      "pic_id",
      "siklus",
      "total",
      "total_ex_momoka",
      "Packing",
      "Reject",
      "Yield",
    ],
    properties: {
      datetime: { type: "string" },
      location_id: { type: "number" },
      pic_id: { type: "number" },
      siklus: { type: "number" },
      total: { type: "number" },
      total_ex_momoka: { type: "number" },
      Packing: {
        type: "array",
        items: {
          type: "object",
          properties: {
            package_id: { type: "number" },
            quantity: { type: "number" },
          },
        },
      },
      Reject: {
        type: "array",
        items: {
          type: "object",
          properties: {
            reason_id: { type: "number" },
            quantity: { type: "number" },
          },
        },
      },
      Yield: {
        type: "array",
        items: {
          type: "object",
          properties: {
            variant_grade_id: { type: "number" },
            quantity: { type: "number" },
          },
        },
      },
    },
  },
};
