import { Prisma as PrismaOrm } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import { hash } from 'bcrypt';
import prisma from '../helpers/prisma';

import {
  errorResponse,
  successResponseWithData,
  validationErrorWithData,
} from '../helpers/api-response.helper';

export interface TodoDto {
  id: string;
  isDone: boolean;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const selected = {
  id: true,
  createdAt: true,
  updatedAt: true,
  isDone: true,
  name: true,
};

export const add: RequestHandler = async (req: Request, res: Response) => {
  try {
    const auth = req.user;
    if (auth && 'email' in auth) {
      const { email } = auth;
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: { id: true },
      });
      if (user) {
        const todo = req.body;
        todo.userId = user.id;
        const newTodo = await prisma.todo.create({
          data: todo,
          select: selected,
        });
        return successResponseWithData<TodoDto>(res, newTodo);
      }
    }
    return errorResponse(res);
  } catch (error) {
    return errorResponse(res);
  }
};

export const getAll: RequestHandler = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: selected,
    });
    return successResponseWithData<TodoDto[]>(res, todos);
  } catch (err) {
    return errorResponse(res);
  }
};

export const remove: RequestHandler = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deletedTodo = await prisma.todo.delete({
      where: { id },
      select: {
        id: true,
      },
    });
    return successResponseWithData<{ id: string }>(res, deletedTodo);
  } catch (error) {
    return errorResponse(res);
  }
};

export const update: RequestHandler = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const todo = req.body;
    const { isDone, name } = todo;
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { isDone, name },
      select: selected,
    });
    return successResponseWithData<TodoDto>(res, updatedTodo);
  } catch (error) {
    return errorResponse(res);
  }
};
