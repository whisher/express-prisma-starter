import { Router } from 'express';

import { validateBody } from '../middlewares/validate';
import {
  authLoginValidation,
  authSignInValidation,
} from '../validations/auth.validation';

import { login, signIn } from '../controllers/auth.controller';

const router = Router();

router.post('/login', validateBody(authLoginValidation), login);
router.post('/signin', validateBody(authSignInValidation), signIn);

export { router };
