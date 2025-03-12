import { rejectSchema } from '../schemas/rejectSchema.js';

export default async function rejectRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all rejects
  fastify.get('/api/v1/reject', async (request, reply) => {
    try {
      const rejects = await prisma.reject.findMany({
        where: { is_active: true },
        include: {
          harvest: true,
          reason: true
        }
      });
      return rejects;
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch rejects' });
    }
  });

  // GET single reject by ID
  fastify.get('/api/v1/reject/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const reject = await prisma.reject.findUnique({
        where: { id: parseInt(id) },
        include: {
          harvest: true,
          reason: true
        }
      });
      if (!reject) {
        return reply.code(404).send({ error: 'Reject not found' });
      }
      return reject;
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch reject' });
    }
  });

  // POST create new reject
  fastify.post('/api/v1/reject', { schema: rejectSchema }, async (request, reply) => {
    const { harvest_id, reason_id, quantity } = request.body;
    try {
      // Check if harvest exists
      const harvest = await prisma.harvest.findUnique({
        where: { id: harvest_id }
      });
      if (!harvest) {
        return reply.code(404).send({ error: 'Harvest not found' });
      }

      // Check if reason exists
      const reason = await prisma.rejectReason.findUnique({
        where: { id: reason_id }
      });
      if (!reason) {
        return reply.code(404).send({ error: 'Reject reason not found' });
      }

      const newReject = await prisma.reject.create({
        data: {
          harvest_id,
          reason_id,
          quantity,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          harvest: true,
          reason: true
        }
      });
      return newReject;
    } catch (error) {
      reply.code(500).send({ error: 'Failed to create reject' });
    }
  });

  // DELETE reject (soft delete)
  fastify.delete('/api/v1/reject/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      await prisma.reject.update({
        where: { id: parseInt(id) },
        data: { 
          is_active: false,
          updatedAt: new Date()
        }
      });
      return { message: 'Reject deactivated successfully' };
    } catch (error) {
      reply.code(500).send({ error: 'Failed to deactivate reject' });
    }
  });
}
