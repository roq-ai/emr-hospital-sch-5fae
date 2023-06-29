import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { healthcareProviderValidationSchema } from 'validationSchema/healthcare-providers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.healthcare_provider
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getHealthcareProviderById();
    case 'PUT':
      return updateHealthcareProviderById();
    case 'DELETE':
      return deleteHealthcareProviderById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getHealthcareProviderById() {
    const data = await prisma.healthcare_provider.findFirst(convertQueryToPrismaUtil(req.query, 'healthcare_provider'));
    return res.status(200).json(data);
  }

  async function updateHealthcareProviderById() {
    await healthcareProviderValidationSchema.validate(req.body);
    const data = await prisma.healthcare_provider.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteHealthcareProviderById() {
    const data = await prisma.healthcare_provider.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
