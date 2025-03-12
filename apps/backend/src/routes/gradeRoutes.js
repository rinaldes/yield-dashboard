import { gradeSchema } from "../schemas/gradeSchema.js";

export default async function gradeRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all grades
  fastify.get("/api/v1/grade", async (request, reply) => {
    try {
      const grades = await prisma.grade.findMany({
        where: { is_active: true },
      });
      return grades;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch grades" });
    }
  });

  // GET single grade by ID
  fastify.get("/api/v1/grade/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const grade = await prisma.grade.findUnique({
        where: { id: parseInt(id) },
      });
      if (!grade) {
        return reply.code(404).send({ error: "Grade not found" });
      }
      return grade;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch grade" });
    }
  });

  // POST create new grade
  fastify.post(
    "/api/v1/grade",
    { schema: gradeSchema },
    async (request, reply) => {
      const { name, description } = request.body;
      try {
        // Check if name already exists
        const existingGrade = await prisma.grade.findFirst({
          where: { name, is_active: true },
        });
        if (existingGrade) {
          return reply
            .code(409)
            .send({ error: "Grade with this name already exists" });
        }

        const newGrade = await prisma.grade.create({
          data: {
            name,
            description,
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        return newGrade;
      } catch (error) {
        reply.code(500).send({ error: "Failed to create grade" });
      }
    }
  );

  // PUT update grade
  fastify.put("/api/v1/grade/:id", async (request, reply) => {
    const { id } = request.params;
    const { name, description } = request.body;
    try {
      // Check if name already exists for another grade
      const existingGrade = await prisma.grade.findFirst({
        where: { name, is_active: true, NOT: { id: parseInt(id) } },
      });
      if (existingGrade) {
        return reply
          .code(409)
          .send({ error: "Grade with this name already exists" });
      }

      const updatedGrade = await prisma.grade.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          updatedAt: new Date(),
        },
      });
      return updatedGrade;
    } catch (error) {
      reply.code(500).send({ error: "Failed to update grade" });
    }
  });

  // DELETE grade (soft delete)
  fastify.delete("/api/v1/grade/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      await prisma.grade.update({
        where: { id: parseInt(id) },
        data: {
          is_active: false,
          updatedAt: new Date(),
        },
      });
      return { message: "Grade deactivated successfully" };
    } catch (error) {
      reply.code(500).send({ error: "Failed to deactivate grade" });
    }
  });
}
