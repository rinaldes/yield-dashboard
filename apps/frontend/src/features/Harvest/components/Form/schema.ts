import * as z from "zod";

const rejectSchema = z.object({
  jamur: z.optional(z.number().min(0)),
  mildew: z.optional(z.number().min(0)),
  jamurHijau: z.optional(z.number().min(0)),
  siput: z.optional(z.number().min(0)),
  cracking: z.optional(z.number().min(0)),
  overripe: z.optional(z.number().min(0)),
  fisik: z.optional(z.number().min(0)),
  hama: z.optional(z.number().min(0)),
  polinasi: z.optional(z.number().min(0)),
  gradeC: z.optional(z.number().min(0)),
  orange: z.optional(z.number().min(0)),
});

const yieldSchema = z.object({
  momokaGradeA: z.optional(z.number().min(0)),
  momokaGradeB: z.optional(z.number().min(0)),
  momokaGradeMix: z.optional(z.number().min(0)),
  tochiotomeGradeA: z.optional(z.number().min(0)),
  tochiotomeGradeB: z.optional(z.number().min(0)),
  tochiotomeGradeMix: z.optional(z.number().min(0)),
});

export const schema = z.object({
  datetime: z.string(),
  harvestLocation: z.number(),
  pic: z.number(),
  siklus: z.optional(z.number().min(0)),
  packGradeA: z.optional(z.number().min(0)),
  packGradeA15pcs: z.optional(z.number().min(0)),
  frozenWeight: z.optional(z.number().min(0)),
  wastedWeight: z.optional(z.number().min(0)),
  packGradeB: z.optional(z.number().min(0)),
  momoka3pcs: z.optional(z.number().min(0)),
  momoka6pcs: z.optional(z.number().min(0)),
  momokaA11: z.optional(z.number().min(0)),
  momokaA15: z.optional(z.number().min(0)),
  momokaGradeB: z.optional(z.number().min(0)),
  hatsuhana3pcs: z.optional(z.number().min(0)),
  hatsuhana4pcs: z.optional(z.number().min(0)),
  hatsuhana6pcs: z.optional(z.number().min(0)),
  giftbox: z.optional(z.number().min(0)),
  total: z.number().min(0),
  totalExMomoka: z.number().min(0),
  reject: rejectSchema,
  yield: yieldSchema,
});

export type RejectSchema = z.output<typeof rejectSchema>;
export type YieldSchema = z.output<typeof yieldSchema>;
export type Schema = z.output<typeof schema>;
