import { yieldSchema } from "../schemas/yieldSchema.js";

export default async function yieldRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all yields
  fastify.get("/api/v1/yield", async (request, reply) => {
    try {
      const yields = await prisma.yield.findMany({
        where: { is_active: true },
        include: {
          harvest: true,
          YieldVariant: {
            include: {
              variantGrade: {
                include: {
                  variant: true,
                  grade: true,
                },
              },
            },
          },
        },
      });
      return yields;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch yields" });
    }
  });

  // GET single yield by ID
  fastify.get("/api/v1/yield/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const yieldCrop = await prisma.yield.findUnique({
        where: { id: parseInt(id) },
        include: {
          harvest: true,
          YieldVariant: {
            include: {
              variantGrade: {
                include: {
                  variant: true,
                  grade: true,
                },
              },
            },
          },
        },
      });
      if (!yieldCrop) {
        return reply.code(404).send({ error: "Yield not found" });
      }
      return yieldCrop;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch yield" });
    }
  });

  // POST create new yield
  fastify.post(
    "/api/v1/yield",
    { schema: yieldSchema },
    async (request, reply) => {
      const { harvest_id } = request.body;
      try {
        // Check if harvest exists
        const harvest = await prisma.harvest.findUnique({
          where: { id: harvest_id },
        });
        if (!harvest) {
          return reply.code(404).send({ error: "Harvest not found" });
        }

        const newYield = await prisma.yield.create({
          data: {
            harvest_id,
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            harvest: true,
          },
        });
        return newYield;
      } catch (error) {
        reply.code(500).send({ error: "Failed to create yield" });
      }
    }
  );

  // DELETE yield (soft delete)
  fastify.delete("/api/v1/yield/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      await prisma.yield.update({
        where: { id: parseInt(id) },
        data: {
          is_active: false,
          updatedAt: new Date(),
        },
      });
      return { message: "Yield deactivated successfully" };
    } catch (error) {
      reply.code(500).send({ error: "Failed to deactivate yield" });
    }
  });
}
