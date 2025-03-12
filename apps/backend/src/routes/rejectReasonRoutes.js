import { rejectReasonSchema } from '../schemas/rejectReasonSchema.js';

export default async function rejectReasonRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET all reject reasons
  fastify.get('/api/v1/reject-reason', async (request, reply) => {
    try {
      const reasons = await prisma.rejectReason.findMany({
        where: { is_active: true }
      });
      return reasons;
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch reject reasons' });
    }
  });

  // GET single reject reason by ID
  fastify.get('/api/v1/reject-reason/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const reason = await prisma.rejectReason.findUnique({
        where: { id: parseInt(id) }
      });
      if (!reason) {
        return reply.code(404).send({ error: 'Reject reason not found' });
      }
      return reason;
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch reject reason' });
    }
  });

  // POST create new reject reason
  fastify.post('/api/v1/reject-reason', { schema: rejectReasonSchema }, async (request, reply) => {
    const { name, description } = request.body;
    try {
      // Check if name already exists
      const existingReason = await prisma.rejectReason.findFirst({
        where: { name, is_active: true }
      });
      if (existingReason) {
        return reply.code(409).send({ error: 'Reject reason with this name already exists' });
      }

      const newReason = await prisma.rejectReason.create({
        data: {
          name,
          description,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      return newReason;
    } catch (error) {
      reply.code(500).send({ error: 'Failed to create reject reason' });
    }
  });

  // PUT update reject reason
  fastify.put('/api/v1/reject-reason/:id', async (request, reply) => {
    const { id } = request.params;
    const { name, description } = request.body;
    try {
      // Check if name already exists for another reason
      const existingReason = await prisma.rejectReason.findFirst({
        where: { name, is_active: true, NOT: { id: parseInt(id) } }
      });
      if (existingReason) {
        return reply.code(409).send({ error: 'Reject reason with this name already exists' });
      }

      const updatedReason = await prisma.rejectReason.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          updatedAt: new Date()
        }
      });
      return updatedReason;
    } catch (error) {
      reply.code(500).send({ error: 'Failed to update reject reason' });
    }
  });

  // DELETE reject reason (soft delete)
  fastify.delete('/api/v1/reject-reason/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      await prisma.rejectReason.update({
        where: { id: parseInt(id) },
        data: { 
          is_active: false,
          updatedAt: new Date()
        }
      });
      return { message: 'Reject reason deactivated successfully' };
    } catch (error) {
      reply.code(500).send({ error: 'Failed to deactivate reject reason' });
    }
  });
}
