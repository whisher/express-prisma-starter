import { Router } from 'express';

import { authLoginValidation } from '../validations/auth.validation';

import { login, signIn } from '../controllers/auth.controller';

const router = Router();

router.post('/login', authLoginValidation, login);
router.post('/signin', signIn);

export { router };
