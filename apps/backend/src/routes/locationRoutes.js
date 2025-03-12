import { locationSchema } from "../schemas/locationSchema.js";

export default async function locationRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all locations with their details
  fastify.get("/api/v1/location", async (request, reply) => {
    const { includeDetails } = request.query;

    try {
      const locations = await prisma.location.findMany({
        where: { is_active: true },
        include: {
          LocationDetail: includeDetails === "true",
        },
      });

      if (includeDetails === "true") {
        const transformedLocations = locations.map((location) => ({
          ...location,
          total_plants: location.LocationDetail?.[0]?.total_plants || 0,
          planting_date: location.LocationDetail?.[0]?.planting_date || null,
          width: location.LocationDetail?.[0]?.width || 0,
          height: location.LocationDetail?.[0]?.height || 0,
          length: location.LocationDetail?.[0]?.length || 0,
          area: location.LocationDetail?.[0]?.area || 0,
        }));

        return transformedLocations.map(({ LocationDetail, ...rest }) => rest);
      }

      return locations;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch locations" });
    }
  });

  // GET single location by ID with details
  fastify.get("/api/v1/location/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const location = await prisma.location.findUnique({
        where: { id: parseInt(id) },
        include: { LocationDetail: true },
      });
      if (!location) {
        return reply.code(404).send({ error: "Location not found" });
      }
      return location;
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch location" });
    }
  });

  // POST create new location with details
  fastify.post(
    "/api/v1/location",
    { schema: locationSchema },
    async (request, reply) => {
      const {
        name,
        is_indoors,
        description,
        total_plants,
        planting_date,
        width,
        height,
        length,
        area,
      } = request.body;

      try {
        const existingLocation = await prisma.location.findFirst({
          where: { name, is_active: true },
        });
        if (existingLocation) {
          return reply
            .code(409)
            .send({ error: "Location with this name already exists" });
        }

        const newLocation = await prisma.location.create({
          data: {
            name,
            is_indoors,
            description,
            is_active: true,
            LocationDetail: {
              create: {
                total_plants,
                planting_date,
                width,
                height,
                length,
                area: width * length,
              },
            },
          },
          include: { LocationDetail: true },
        });
        return newLocation;
      } catch (error) {
        reply.code(500).send({ error: "Failed to create location" });
      }
    }
  );

  // PUT /api/v1/location/:id
  fastify.put("/api/v1/location/:id", async (request, reply) => {
    const { id } = request.params;
    const {
      name,
      is_indoors,
      description,
      total_plants,
      planting_date,
      width,
      height,
      length,
      area,
    } = request.body;

    try {
      const existingLocation = await prisma.location.findFirst({
        where: { name, is_active: true, NOT: { id: parseInt(id) } },
      });
      if (existingLocation) {
        return reply
          .code(409)
          .send({ error: "Location with this name already exists" });
      }

      // First get the LocationDetail ID
      const locationDetail = await prisma.locationDetail.findFirst({
        where: { location_id: parseInt(id) },
      });

      const updatedLocation = await prisma.location.update({
        where: { id: parseInt(id) },
        data: {
          name,
          is_indoors,
          description,
          LocationDetail: {
            update: {
              where: { id: locationDetail.id },
              data: {
                total_plants,
                planting_date,
                width,
                height,
                length,
                area: width * length,
              },
            },
          },
        },
        include: { LocationDetail: true },
      });
      return updatedLocation;
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  // DELETE location (soft delete)
  fastify.delete("/api/v1/location/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      await prisma.location.update({
        where: { id: parseInt(id) },
        data: { is_active: false },
      });
      return { message: "Location deactivated successfully" };
    } catch (error) {
      reply.code(500).send({ error: "Failed to deactivate location" });
    }
  });
}
