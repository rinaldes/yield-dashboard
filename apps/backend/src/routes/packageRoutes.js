// routes/packageRoutes.js
import { packageSchema } from "../schemas/packageSchema.js";

export default async function packageRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all packages
  fastify.get("/api/v1/package", async (request, reply) => {
    try {
      const packages = await prisma.package.findMany({
        where: { is_active: true },
        include: { variant: true },
      });
      return packages;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch packages" });
    }
  });

  // GET single package by ID
  fastify.get("/api/v1/package/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const packageMarketable = await prisma.package.findUnique({
        where: { id: parseInt(id) },
        include: { variant: true },
      });
      if (!packageMarketable) {
        return reply.code(404).send({ error: "Package not found" });
      }
      return packageMarketable;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch package" });
    }
  });

  // POST create new package
  fastify.post(
    "/api/v1/package",
    { schema: packageSchema },
    async (request, reply) => {
      const { name, variant_id, description } = request.body;
      try {
        // Check if name already exists
        const existingPackage = await prisma.package.findFirst({
          where: { name, is_active: true },
        });
        if (existingPackage) {
          return reply
            .code(409)
            .send({ error: "Package with this name already exists" });
        }

        // Check if variant exists
        const variant = await prisma.variant.findUnique({
          where: { id: variant_id },
        });
        if (!variant) {
          return reply.code(404).send({ error: "Variant not found" });
        }

        const newPackage = await prisma.package.create({
          data: {
            name,
            variant_id,
            description,
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          include: { variant: true },
        });
        return newPackage;
      } catch (error) {
        reply.code(500).send({ error: "Failed to create package" });
      }
    }
  );

  // PUT update package
  fastify.put("/api/v1/package/:id", async (request, reply) => {
    const { id } = request.params;
    const { name, variant_id, description } = request.body;
    try {
      // Check if name already exists for another package
      const existingPackage = await prisma.package.findFirst({
        where: { name, is_active: true, NOT: { id: parseInt(id) } },
      });
      if (existingPackage) {
        return reply
          .code(409)
          .send({ error: "Package with this name already exists" });
      }

      // Check if variant exists
      const variant = await prisma.variant.findUnique({
        where: { id: variant_id },
      });
      if (!variant) {
        return reply.code(404).send({ error: "Variant not found" });
      }

      const updatedPackage = await prisma.package.update({
        where: { id: parseInt(id) },
        data: {
          name,
          variant_id,
          description,
          updatedAt: new Date(),
        },
        include: { variant: true },
      });
      return updatedPackage;
    } catch (error) {
      reply.code(500).send({ error: "Failed to update package" });
    }
  });

  // DELETE package (soft delete)
  fastify.delete("/api/v1/package/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      await prisma.package.update({
        where: { id: parseInt(id) },
        data: {
          is_active: false,
          updatedAt: new Date(),
        },
      });
      return { message: "Package deactivated successfully" };
    } catch (error) {
      reply.code(500).send({ error: "Failed to deactivate package" });
    }
  });
}
