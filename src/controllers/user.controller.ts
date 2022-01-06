import { RequestHandler } from 'express';
import prisma from '../helpers/prisma';

import {
  errorResponse,
  successResponseWithData,
} from '../helpers/api-response.helper';

export const account: RequestHandler = async (req, res) => {
  try {
    const auth = req.user;
    if (auth && 'email' in auth) {
      const { email } = auth;
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
        select: { id: true, email: true, role: true },
      });
      if (user) {
        return successResponseWithData<{
          id: string;
          email: string;
          role: string;
        }>(res, user);
      }
    }

    return successResponseWithData<Express.User | undefined>(res, auth);
  } catch (err) {
    return errorResponse(res);
  }
};
