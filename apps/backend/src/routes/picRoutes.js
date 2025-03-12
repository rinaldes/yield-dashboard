import { picSchema } from "../schemas/picSchema.js";

export default async function picRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all pics
  fastify.get("/api/v1/pic", async (request, reply) => {
    try {
      const pics = await prisma.pic.findMany({
        where: { is_active: true },
      });
      return pics;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch pics" });
    }
  });

  // GET single pic by ID
  fastify.get("/api/v1/pic/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const pic = await prisma.pic.findUnique({
        where: { id: parseInt(id) },
      });
      if (!pic) {
        return reply.code(404).send({ error: "Pic not found" });
      }
      return pic;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch pic" });
    }
  });

  // POST create new pic
  fastify.post("/api/v1/pic", { schema: picSchema }, async (request, reply) => {
    const { name } = request.body;
    try {
      // Check if name already exists
      const existingPic = await prisma.pic.findFirst({
        where: { name, is_active: true },
      });
      if (existingPic) {
        return reply
          .code(409)
          .send({ error: "Pic with this name already exists" });
      }

      const newPic = await prisma.pic.create({
        data: {
          name,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return newPic;
    } catch (error) {
      reply.code(500).send({ error: "Failed to create pic" });
    }
  });

  // PUT update pic
  fastify.put("/api/v1/pic/:id", async (request, reply) => {
    const { id } = request.params;
    const { name } = request.body;
    try {
      // Check if name already exists for another pic
      const existingPic = await prisma.pic.findFirst({
        where: { name, is_active: true, NOT: { id: parseInt(id) } },
      });
      if (existingPic) {
        return reply
          .code(409)
          .send({ error: "Pic with this name already exists" });
      }

      const updatedPic = await prisma.pic.update({
        where: { id: parseInt(id) },
        data: {
          name,
          updatedAt: new Date(),
        },
      });
      return updatedPic;
    } catch (error) {
      reply.code(500).send({ error: "Failed to update pic" });
    }
  });

  // DELETE pic (soft delete)
  fastify.delete("/api/v1/pic/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      await prisma.pic.update({
        where: { id: parseInt(id) },
        data: {
          is_active: false,
          updatedAt: new Date(),
        },
      });
      return { message: "Pic deactivated successfully" };
    } catch (error) {
      reply.code(500).send({ error: "Failed to deactivate pic" });
    }
  });
}
