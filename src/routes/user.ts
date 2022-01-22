// Core
import { Router } from 'express';

// Controllers
import {
  account,
  create,
  remove,
  update,
  users,
} from '../controllers/user.controller';

// Middlewares
import auth from '../middlewares/jwt';
import { isAdmin } from '../middlewares/isAdmin';
import { validateBody } from '../middlewares/validate';

// Validations
import {
  userCreateValidation,
  userRemoveValidation,
  userUpdateValidation,
} from '../validations/user.validation';

const router = Router();

router.post(
  '/remove',
  auth,
  isAdmin,
  validateBody(userRemoveValidation),
  remove
);
router.get('/account', auth, account);
router.get('/all', auth, isAdmin, users);
router.post(
  '/create',
  auth,
  isAdmin,
  validateBody(userCreateValidation),
  create
);
router.put(
  '/update',
  auth,
  isAdmin,
  validateBody(userUpdateValidation),
  update
);

export { router };
