import { brixSchema } from "../schemas/brixSchema.js";

export default async function brixRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all brix data
  fastify.get("/api/v1/brix", async (request, reply) => {
    try {
      const brixData = await prisma.brix.findMany({
        where: { is_active: true },
        include: { location: true },
      });
      return brixData;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch brix data" });
    }
  });

  // GET brix data by location
  fastify.get("/api/v1/brix/:location_id", async (request, reply) => {
    const { location_id } = request.params;
    try {
      const brixData = await prisma.brix.findMany({
        where: {
          location_id: parseInt(location_id),
          is_active: true,
        },
      });
      if (!brixData) {
        return reply.code(404).send({ error: "Brix data not found" });
      }
      return brixData;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch brix data" });
    }
  });

  // POST create new brix entry
  fastify.post(
    "/api/v1/brix",
    { schema: brixSchema },
    async (request, reply) => {
      const { location_id, pic_id, from, type, brix_score } = request.body;
      try {
        const newBrix = await prisma.brix.create({
          data: {
            location_id: parseInt(location_id),
            pic_id: parseInt(pic_id),
            from,
            type,
            brix_score: parseFloat(brix_score),
            is_active: true,
          },
        });
        return newBrix;
      } catch (error) {
        reply.code(500).send({ error });
      }
    }
  );

  // PUT update brix entry
  fastify.put("/api/v1/brix/:id", async (request, reply) => {
    const { id } = request.params;
    const { brix_score, type } = request.body;
    try {
      const updatedBrix = await prisma.brix.update({
        where: { id: parseInt(id) },
        data: {
          brix_score: parseFloat(brix_score),
          type,
        },
      });
      return updatedBrix;
    } catch (error) {
      reply.code(500).send({ error: "Failed to update brix entry" });
    }
  });

  // DELETE (deactivate) brix entry
  fastify.delete("/api/v1/brix/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      await prisma.brix.update({
        where: { id: parseInt(id) },
        data: { is_active: false },
      });
      return { message: "Brix entry deactivated successfully" };
    } catch (error) {
      reply.code(500).send({ error: "Failed to deactivate brix entry" });
    }
  });
}
