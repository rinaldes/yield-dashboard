export const forecastBaseSchema = {
  id: { type: "string" },
  week: { type: "string", format: "date-time" },
  location_id: { type: "integer", minimum: 1 },
  pic_id: { type: "integer", minimum: 1 },
  total: { type: "number", minimum: 0 },
  total_ex_momoka: { type: "number", minimum: 0 },
  is_active: { type: "boolean" },
  created_at: { type: "string", format: "date-time" },
  updated_at: { type: "string", format: "date-time" },
};

export const forecastVariantSchema = {
  id: { type: "integer", minimum: 1 },
  forecast_id: { type: "string" },
  package_id: { type: "integer", minimum: 1 },
  quantity: { type: "integer", minimum: 0 },
  is_active: { type: "boolean" },
  created_at: { type: "string", format: "date-time" },
  updated_at: { type: "string", format: "date-time" },
};

export const createForecastSchema = {
  body: {
    type: "object",
    required: ["week", "location_id", "pic_id", "total", "total_ex_momoka"],
    properties: {
      week: forecastBaseSchema.week,
      location_id: forecastBaseSchema.location_id,
      pic_id: forecastBaseSchema.pic_id,
      total: forecastBaseSchema.total,
      total_ex_momoka: forecastBaseSchema.total_ex_momoka,
      variants: {
        type: "array",
        items: {
          type: "object",
          required: ["package_id", "quantity"],
          properties: {
            package_id: forecastVariantSchema.package_id,
            quantity: forecastVariantSchema.quantity,
          },
        },
      },
    },
  },
};

export const updateForecastSchema = {
  body: createForecastSchema.body,
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: forecastBaseSchema.id,
    },
  },
};

export const getForecastSchema = {
  params: updateForecastSchema.params,
};

export const deleteForecastSchema = {
  params: updateForecastSchema.params,
};

export const forecastSchema = {
  body: {
    type: "object",
    required: ["week", "location_id", "pic_id", "total", "total_ex_momoka"],
    properties: {
      week: { type: "string" },
      location_id: { type: "number" },
      pic_id: { type: "number" },
      total: { type: "number" },
      total_ex_momoka: { type: "number" },
      description: { type: "string", maxLength: 500 },
      is_active: { type: "boolean", default: true },
    },
  },
};
