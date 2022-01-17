import { RequestHandler } from 'express';
import { notFoundResponse } from '../helpers/api-response.helper';

export const isAdmin: RequestHandler = (req, res, next) => {
  const auth = req.user;
  if (auth && 'role' in auth) {
    const { role } = auth;
    if (role === 'admin') {
      return next();
    }
    return notFoundResponse(res);
  }
  return notFoundResponse(res);
};
