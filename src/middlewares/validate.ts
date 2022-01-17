import { RequestHandler } from 'express';

import { AnySchema, ValidationError } from 'yup';

export const validateBody =
  (schema: AnySchema): RequestHandler =>
  async (req, res, next) => {
    try {
      await schema.validate(req.body);
      return next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(422).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
