import { variantGradeSchema } from "../schemas/variantGradeSchema.js";

export default async function variantGradeRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all variant grades
  fastify.get("/api/v1/variant-grade", async (request, reply) => {
    try {
      const variantGrades = await prisma.variantGrade.findMany({
        where: { is_active: true },
        include: {
          variant: true,
          grade: true,
        },
      });
      return variantGrades;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch variant grades" });
    }
  });

  // GET single variant grade by ID
  fastify.get("/api/v1/variant-grade/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const variantGrade = await prisma.variantGrade.findUnique({
        where: { id: parseInt(id) },
        include: {
          variant: true,
          grade: true,
        },
      });
      if (!variantGrade) {
        return reply.code(404).send({ error: "Variant grade not found" });
      }
      return variantGrade;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch variant grade" });
    }
  });

  // POST create new variant grade
  fastify.post(
    "/api/v1/variant-grade",
    { schema: variantGradeSchema },
    async (request, reply) => {
      const { variant_id, grade_id } = request.body;
      try {
        // Check if combination already exists
        const existingVariantGrade = await prisma.variantGrade.findFirst({
          where: { variant_id, grade_id, is_active: true },
        });
        if (existingVariantGrade) {
          return reply
            .code(409)
            .send({ error: "Variant grade combination already exists" });
        }

        const newVariantGrade = await prisma.variantGrade.create({
          data: {
            variant_id,
            grade_id,
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            variant: true,
            grade: true,
          },
        });
        return newVariantGrade;
      } catch (error) {
        reply.code(500).send({ error: "Failed to create variant grade" });
      }
    }
  );

  // PUT update variant grade
  fastify.put("/api/v1/variant-grade/:id", async (request, reply) => {
    const { id } = request.params;
    const { variant_id, grade_id } = request.body;
    try {
      // Check if combination already exists for another record
      const existingVariantGrade = await prisma.variantGrade.findFirst({
        where: {
          variant_id,
          grade_id,
          is_active: true,
          NOT: { id: parseInt(id) },
        },
      });
      if (existingVariantGrade) {
        return reply
          .code(409)
          .send({ error: "Variant grade combination already exists" });
      }

      const updatedVariantGrade = await prisma.variantGrade.update({
        where: { id: parseInt(id) },
        data: {
          variant_id,
          grade_id,
          updatedAt: new Date(),
        },
        include: {
          variant: true,
          grade: true,
        },
      });
      return updatedVariantGrade;
    } catch (error) {
      reply.code(500).send({ error: "Failed to update variant grade" });
    }
  });

  // DELETE variant grade (soft delete)
  fastify.delete("/api/v1/variant-grade/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      await prisma.variantGrade.update({
        where: { id: parseInt(id) },
        data: {
          is_active: false,
          updatedAt: new Date(),
        },
      });
      return { message: "Variant grade deactivated successfully" };
    } catch (error) {
      reply.code(500).send({ error: "Failed to deactivate variant grade" });
    }
  });
}
