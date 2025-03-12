export const rejectSchema = {
  body: {
    type: 'object',
    required: ['harvest_id', 'reason_id', 'quantity'],
    properties: {
      harvest_id: { type: 'number', minimum: 1 },
      reason_id: { type: 'number', minimum: 1 },
      quantity: { type: 'number', minimum: 1 }
    }
  }
};
