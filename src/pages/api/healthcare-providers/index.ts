import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { healthcareProviderValidationSchema } from 'validationSchema/healthcare-providers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getHealthcareProviders();
    case 'POST':
      return createHealthcareProvider();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getHealthcareProviders() {
    const data = await prisma.healthcare_provider
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'healthcare_provider'));
    return res.status(200).json(data);
  }

  async function createHealthcareProvider() {
    await healthcareProviderValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.consultation?.length > 0) {
      const create_consultation = body.consultation;
      body.consultation = {
        create: create_consultation,
      };
    } else {
      delete body.consultation;
    }
    const data = await prisma.healthcare_provider.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
