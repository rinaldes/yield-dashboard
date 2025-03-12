import { fruitSchema } from "../schemas/fruitSchema.js";

export default async function fruitRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all fruit
  fastify.get("/api/v1/fruit", async (request, reply) => {
    try {
      const fruit = await prisma.fruit.findMany({
        where: { is_active: true },
      });
      return fruit;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch fruit" });
    }
  });

  // GET single fruit by name
  fastify.get("/api/v1/fruit/:name", async (request, reply) => {
    const { name } = request.params;
    try {
      const fruit = await prisma.fruit.findFirst({
        where: { name, is_active: true },
      });
      if (!fruit) {
        return reply.code(404).send({ error: "Fruit not found" });
      }
      return fruit;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch fruit" });
    }
  });

  // POST create new fruit
  fastify.post(
    "/api/v1/fruit",
    { schema: fruitSchema },
    async (request, reply) => {
      const { name } = request.body;
      try {
        // Check if name already exists
        const existingFruit = await prisma.fruit.findFirst({
          where: { name, is_active: true },
        });
        if (existingFruit) {
          return reply
            .code(409)
            .send({ error: "Fruit with this name already exists" });
        }

        const newFruit = await prisma.fruit.create({
          data: {
            name,
            is_active: true,
          },
        });
        return newFruit;
      } catch (error) {
        reply.code(500).send({ error: "Failed to create fruit" });
      }
    }
  );

  // PUT update fruit
  fastify.put("/api/v1/fruit/:name", async (request, reply) => {
    const { name } = request.params;
    const { newName } = request.body;
    try {
      // Check if new name already exists
      const existingFruit = await prisma.fruit.findFirst({
        where: { name: newName, is_active: true },
      });
      if (existingFruit) {
        return reply
          .code(409)
          .send({ error: "Fruit with this name already exists" });
      }

      const updatedFruit = await prisma.fruit.update({
        where: { name },
        data: {
          name: newName,
        },
      });
      return updatedFruit;
    } catch (error) {
      reply.code(500).send({ error: "Failed to update fruit" });
    }
  });

  fastify.delete("/api/v1/fruit/:name", async (request, reply) => {
    const { name } = request.params;
    try {
      await prisma.fruit.update({
        where: { name },
        data: { is_active: false },
      });
      return { message: "Fruit deactivated successfully" };
    } catch (error) {
      reply.code(500).send({ error: "Failed to deactivate fruit" });
    }
  });
}
