import { Router } from 'express';

import { login, signIn } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/signin', signIn);

export { router };
