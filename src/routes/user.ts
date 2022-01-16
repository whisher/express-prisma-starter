import { Router } from 'express';

import { account, users } from '../controllers/user.controller';

import auth from '../middlewares/jwt';

const router = Router();

router.get('/account', auth, account);
router.get('/all', auth, users);

export { router };
