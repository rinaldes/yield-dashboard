import { harvestSchema } from "../schemas/harvestSchema.js";

export default async function routes(fastify) {
  const { prisma } = fastify;

  // GET all harvest data
  fastify.get("/api/v1/harvest", async (request, reply) => {
    try {
      const harvestData = await prisma.harvest.findMany();
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
        harvestLocation,
        pic,
        packGradeA,
        packGradeA15pcs,
        frozenWeight,
        wastedWeight,
        packGradeB,
        momoka3pcs,
        momokaA11,
        momokaA15,
        momokaGradeB,
        hatsuhana3pcs,
        hatsuhana4pcs,
        hatsuhana6pcs,
        giftbox,
        total,
        totalExMomoka,
      } = request.body;
      const isoDatetime = new Date(datetime).toISOString();

      try {
        const newHarvest = await prisma.harvest.create({
          data: {
            datetime: isoDatetime,
            harvestLocation,
            pic,
            packGradeA,
            packGradeA15pcs,
            frozenWeight,
            wastedWeight,
            packGradeB,
            momoka3pcs,
            momokaA11,
            momokaA15,
            momokaGradeB,
            hatsuhana3pcs,
            hatsuhana4pcs,
            hatsuhana6pcs,
            giftbox,
            total,
            totalExMomoka,
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
    const updateData = request.body;

    try {
      const updatedHarvest = await prisma.harvest.update({
        where: { id: parseInt(id) },
        data: updateData,
      });
      reply.send(updatedHarvest);
    } catch (err) {
      reply
        .status(500)
        .send({ error: "Failed to update harvest data", details: err.message });
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
