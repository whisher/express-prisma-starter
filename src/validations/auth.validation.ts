import { object, string } from 'yup';

import { validateBody } from '../middlewares/validate';

export const authLoginValidation = validateBody(
  object({
    email: string().required().email(),
    password: string().required(),
  })
);
