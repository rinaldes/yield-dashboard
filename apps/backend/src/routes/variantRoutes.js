import { variantSchema } from "../schemas/variantSchema.js";

export default async function variantRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all variants
  fastify.get("/api/v1/variant", async (request, reply) => {
    try {
      const variants = await prisma.variant.findMany({
        where: { is_active: true },
        include: { fruit: true },
      });
      return variants;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch variants" });
    }
  });

  // GET single variant by ID
  fastify.get("/api/v1/variant/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const variant = await prisma.variant.findUnique({
        where: { id: parseInt(id) },
        include: { fruit: true },
      });
      if (!variant) {
        return reply.code(404).send({ error: "Variant not found" });
      }
      return variant;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch variant" });
    }
  });

  // POST create new variant
  fastify.post(
    "/api/v1/variant",
    { schema: variantSchema },
    async (request, reply) => {
      const { name, fruit_id, description } = request.body;
      try {
        // Check if name already exists
        const existingVariant = await prisma.variant.findFirst({
          where: { name, is_active: true },
        });
        if (existingVariant) {
          return reply
            .code(409)
            .send({ error: "Variant with this name already exists" });
        }

        // Check if fruit exists
        const fruit = await prisma.fruit.findUnique({
          where: { id: fruit_id },
        });
        if (!fruit) {
          return reply.code(404).send({ error: "Fruit not found" });
        }

        const newVariant = await prisma.variant.create({
          data: {
            name,
            fruit_id,
            description,
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        return newVariant;
      } catch (error) {
        reply.code(500).send({ error: "Failed to create variant" });
      }
    }
  );

  // PUT update variant
  fastify.put("/api/v1/variant/:id", async (request, reply) => {
    const { id } = request.params;
    const { name, fruit_id, description } = request.body;
    try {
      // Check if name already exists for another variant
      const existingVariant = await prisma.variant.findFirst({
        where: { name, is_active: true, NOT: { id: parseInt(id) } },
      });
      if (existingVariant) {
        return reply
          .code(409)
          .send({ error: "Variant with this name already exists" });
      }

      // Check if fruit exists
      const fruit = await prisma.fruit.findUnique({
        where: { id: fruit_id },
      });
      if (!fruit) {
        return reply.code(404).send({ error: "Fruit not found" });
      }

      const updatedVariant = await prisma.variant.update({
        where: { id: parseInt(id) },
        data: {
          name,
          fruit_id,
          description,
          updatedAt: new Date(),
        },
      });
      return updatedVariant;
    } catch (error) {
      reply.code(500).send({ error: "Failed to update variant" });
    }
  });

  // DELETE variant (soft delete)
  fastify.delete("/api/v1/variant/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      await prisma.variant.update({
        where: { id: parseInt(id) },
        data: {
          is_active: false,
          updatedAt: new Date(),
        },
      });
      return { message: "Variant deactivated successfully" };
    } catch (error) {
      reply.code(500).send({ error: "Failed to deactivate variant" });
    }
  });
}
