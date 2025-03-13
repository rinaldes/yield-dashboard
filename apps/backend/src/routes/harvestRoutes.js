import { harvestSchema } from "../schemas/harvestSchema.js";

export default async function routes(fastify) {
  const { prisma } = fastify;

  // GET all harvest data
  fastify.get("/api/v1/harvest", async (request, reply) => {
    try {
      const harvestData = await prisma.harvest.findMany({
        include: {
          location: true,
          pic: true,
          Packing: {
            include: {
              package: true,
            },
          },
          Reject: {
            include: {
              reason: true,
            },
          },
          Yield: {
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
      return harvestData;
    } catch (err) {
      reply
        .status(500)
        .send({ error: "Failed to fetch harvest data", details: err.message });
    }
  });

  // GET harvest data by ID
  fastify.get("/api/v1/harvest/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      const harvestData = await prisma.harvest.findUnique({
        where: { id: parseInt(id) },
        include: {
          location: true,
          pic: true,
          Packing: {
            include: {
              package: true,
            },
          },
          Reject: {
            include: {
              reason: true,
            },
          },
          Yield: {
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

      if (!harvestData) {
        return reply.status(404).send({ error: "Harvest data not found" });
      }

      return harvestData;
    } catch (err) {
      reply
        .status(500)
        .send({ error: "Failed to fetch harvest data", details: err.message });
    }
  });

  fastify.post(
    "/api/v1/harvest",
    { schema: harvestSchema },
    async (request, reply) => {
      const {
        datetime,
        location_id,
        pic_id,
        siklus,
        total,
        total_ex_momoka,
        Packing,
        Reject,
        Yield,
      } = request.body;
      const isoDatetime = new Date(datetime).toISOString();

      try {
        const newHarvest = await prisma.harvest.create({
          data: {
            datetime: isoDatetime,
            location_id,
            pic_id,
            siklus,
            total,
            total_ex_momoka,
            Packing: {
              create: Packing.map((pack) => ({
                package_id: pack.package_id,
                quantity: pack.quantity,
              })),
            },
            Reject: {
              create: Reject.map((reject) => ({
                reason_id: reject.reason_id,
                quantity: reject.quantity,
              })),
            },
            Yield: {
              create: Yield.map((yieldItem) => ({
                variant_grade_id: yieldItem.variant_grade_id,
                quantity: yieldItem.quantity,
              })),
            },
          },
          include: {
            Packing: true,
            Reject: true,
            Yield: true,
          },
        });
        console.log("Successfully created harvest:", newHarvest);
        return newHarvest;
      } catch (error) {
        console.error("Error creating harvest:", error);
        reply.code(500).send({
          error: "Failed to create harvest",
          details: error.message,
        });
      }
    }
  );

  // PUT update harvest data
  fastify.put("/api/v1/harvest/:id", async (request, reply) => {
    const { id } = request.params;
    const {
      datetime,
      location_id,
      pic_id,
      siklus,
      total,
      total_ex_momoka,
      frozen_weight,
      wasted_weight,
      Packing,
      Reject,
      Yield,
    } = request.body;
    const isoDatetime = new Date(datetime).toISOString();

    try {
      // First delete existing related records
      await prisma.packing.deleteMany({ where: { harvest_id: parseInt(id) } });
      await prisma.reject.deleteMany({ where: { harvest_id: parseInt(id) } });
      await prisma.yield.deleteMany({ where: { harvest_id: parseInt(id) } });

      // Then update the harvest and create new related records
      const updatedHarvest = await prisma.harvest.update({
        where: { id: parseInt(id) },
        data: {
          datetime: isoDatetime,
          location: { connect: { id: location_id } },
          pic: { connect: { id: pic_id } },
          siklus,
          total,
          total_ex_momoka,
          frozen_weight,
          wasted_weight,
          Packing: {
            create: Packing.map((pack) => ({
              package_id: pack.package_id,
              quantity: pack.quantity,
            })),
          },
          Reject: {
            create: Reject.map((reject) => ({
              reason_id: reject.reason_id,
              quantity: reject.quantity,
            })),
          },
          Yield: {
            create: Yield.map((yieldItem) => ({
              variant_grade_id: yieldItem.variant_grade_id,
              quantity: yieldItem.quantity,
            })),
          },
        },
        include: {
          Packing: true,
          Reject: true,
          Yield: true,
        },
      });

      reply.send(updatedHarvest);
    } catch (err) {
      reply.status(500).send({
        error: "Failed to update harvest data",
        details: err.message,
      });
    }
  });

  // DELETE harvest data
  fastify.delete("/api/v1/harvest/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      await prisma.harvest.delete({
        where: { id: parseInt(id) },
      });
      reply.send({ message: "Harvest data deleted successfully" });
    } catch (err) {
      reply
        .status(500)
        .send({ error: "Failed to delete harvest data", details: err.message });
    }
  });
}
