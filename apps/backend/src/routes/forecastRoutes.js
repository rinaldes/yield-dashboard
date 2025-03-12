import fp from "fastify-plugin";

async function forecastRoutes(fastify) {
  const { prisma } = fastify;

  fastify.post("/forecasts", async (request, reply) => {
    const { week, location_id, pic_id, total, total_ex_momoka, variants } =
      request.body;

    const forecast = await prisma.$transaction(async (tx) => {
      const forecast = await tx.forecast.create({
        data: {
          week,
          location_id,
          pic_id,
          total,
          total_ex_momoka,
        },
      });

      if (variants && variants.length > 0) {
        await tx.forecastVariant.createMany({
          data: variants.map((variant) => ({
            forecast_id: forecast.id,
            variant_grade_id: variant.variant_grade_id,
            quantity: variant.quantity,
          })),
        });
      }

      return forecast;
    });

    return reply.code(201).send(forecast);
  });

  fastify.get("/forecasts", async (request, reply) => {
    const forecasts = await prisma.forecast.findMany({
      where: { is_active: true },
      include: {
        location: true,
        pic: true,
        forecastVariants: {
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

    return reply.send(forecasts);
  });

  fastify.get("/forecasts/:id", async (request, reply) => {
    const { id } = request.params;

    const forecast = await prisma.forecast.findUnique({
      where: { id },
      include: {
        location: true,
        pic: true,
        forecastVariants: {
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

    if (!forecast) {
      return reply.code(404).send({ message: "Forecast not found" });
    }

    return reply.send(forecast);
  });

  fastify.put("/forecasts/:id", async (request, reply) => {
    const { id } = request.params;
    const { week, location_id, pic_id, total, total_ex_momoka, variants } =
      request.body;

    const forecast = await prisma.$transaction(async (tx) => {
      const forecast = await tx.forecast.update({
        where: { id },
        data: {
          week,
          location_id,
          pic_id,
          total,
          total_ex_momoka,
        },
      });

      await tx.forecastVariant.deleteMany({
        where: { forecast_id: id },
      });

      if (variants && variants.length > 0) {
        await tx.forecastVariant.createMany({
          data: variants.map((variant) => ({
            forecast_id: id,
            variant_grade_id: variant.variant_grade_id,
            quantity: variant.quantity,
          })),
        });
      }

      return forecast;
    });

    return reply.send(forecast);
  });

  fastify.delete("/forecasts/:id", async (request, reply) => {
    const { id } = request.params;

    await prisma.$transaction([
      prisma.forecast.update({
        where: { id },
        data: { is_active: false },
      }),
      prisma.forecastVariant.updateMany({
        where: { forecast_id: id },
        data: { is_active: false },
      }),
    ]);

    return reply.code(204).send();
  });
}

export default fp(forecastRoutes);
