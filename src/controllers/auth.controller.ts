import { Prisma as PrismaOrm } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';

import { compare, hash } from 'bcrypt';

import { decode, sign } from 'jsonwebtoken';

import prisma from '../helpers/prisma';

import {
  errorResponse,
  successResponseWithData,
  unauthorizedResponse,
  validationErrorWithData,
} from '../helpers/api-response.helper';

export interface TypedRequestBody<T> extends Request {
  body: T;
}

type AuthLoginRequest = TypedRequestBody<{
  email: string;
  password: string;
}>;

export interface AuthLoginResponse extends Response {
  token: string;
  expirationEpochSeconds: number;
}

const MSG_INVALID_CREDENTIALS =
  'You have entered an invalid username or password';

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return unauthorizedResponse(res, MSG_INVALID_CREDENTIALS);
    }
    const hasMatch = await compare(password, user.password);
    if (!hasMatch) {
      return unauthorizedResponse(res, MSG_INVALID_CREDENTIALS);
    }
    const userData = {
      email: user.email,
    };
    const jwtPayload = userData;
    const jwtData = {
      expiresIn: process.env.JWT_TIMEOUT,
    };
    const secret = process.env.JWT_SECRET as string;
    const token = sign(jwtPayload, secret, jwtData);
    const { exp } = decode(token) as {
      exp: number;
    };
    const expirationEpochSeconds = exp * 1000;
    return successResponseWithData<{
      token: string;
      expirationEpochSeconds: number;
    }>(res, { token, expirationEpochSeconds });
  } catch (err) {
    return errorResponse(res);
  }
};

export const signIn: RequestHandler = async (req, res) => {
  try {
    const user = req.body;
    user.password = await hash(user.password, 10);
    const { acceptPrivacyPolicy, email, password, username } = user;
    const { email: mail } = await prisma.user.create({
      data: { acceptPrivacyPolicy, email, password, username },
    });
    return successResponseWithData<{ email: string }>(res, { email: mail });
  } catch (error) {
    if (error instanceof PrismaOrm.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return validationErrorWithData(res, 'Account already exists.');
      }
    }
    return errorResponse(res);
  }
};
