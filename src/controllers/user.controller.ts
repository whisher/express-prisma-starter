import { Prisma as PrismaOrm } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import { hash } from 'bcrypt';
import prisma from '../helpers/prisma';

import {
  errorResponse,
  successResponseWithData,
  validationErrorWithData,
} from '../helpers/api-response.helper';

export interface UserDto {
  id: string;
  email: string;
  role: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const account: RequestHandler = async (req: Request, res: Response) => {
  try {
    const auth = req.user;
    if (auth && 'email' in auth) {
      const { email } = auth;
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
        select: { id: true, email: true, role: true, username: true },
      });
      if (user) {
        return successResponseWithData<UserDto>(res, user);
      }
    }

    return errorResponse(res);
  } catch (err) {
    return errorResponse(res);
  }
};

export const create: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    user.password = await hash(user.password, 10);
    const { email, password, username } = user;
    const newUser = await prisma.user.create({
      data: { acceptPrivacyPolicy: true, email, password, username },
    });
    return successResponseWithData<UserDto>(res, newUser);
  } catch (error) {
    if (error instanceof PrismaOrm.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return validationErrorWithData(res, 'Account already exists.');
      }
    }
    return errorResponse(res);
  }
};

export const users: RequestHandler = async (req: Request, res: Response) => {
  try {
    const auth = req.user;
    if (auth && 'role' in auth) {
      const { role } = auth;
      if (role === 'admin') {
        const users = await prisma.user.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            email: true,
            role: true,
            username: true,
          },
        });
        return successResponseWithData<UserDto[]>(res, users);
      }
    }
    return errorResponse(res);
  } catch (err) {
    return errorResponse(res);
  }
};
