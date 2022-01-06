import { Router } from 'express';

import { account } from '../controllers/user.controller';

import auth from '../middlewares/jwt';

const router = Router();

router.get('/account', auth, account);

export { router };
