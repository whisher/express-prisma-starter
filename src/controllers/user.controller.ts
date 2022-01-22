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

export const remove: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const { id } = user;
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return successResponseWithData<UserDto>(res, deletedUser);
  } catch (error) {
    return errorResponse(res);
  }
};
export const update: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const { email, id, username } = user;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { email, username },
    });
    return successResponseWithData<UserDto>(res, updatedUser);
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
  } catch (err) {
    return errorResponse(res);
  }
};
