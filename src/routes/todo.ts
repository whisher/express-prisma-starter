// Core
import { Router } from 'express';

// Controllers
import { add, getAll, remove, update } from '../controllers/todo.controller';

// Middlewares
import auth from '../middlewares/jwt';
import { validateBody } from '../middlewares/validate';

// Validations
import {
  todoCreateValidation,
  todoUpdateValidation,
} from '../validations/todo.validation';

const router = Router();

router.post('', auth, validateBody(todoCreateValidation), add);
router.get('', auth, getAll);
router.delete('/:id', auth, remove);
router.put('/:id', auth, validateBody(todoUpdateValidation), update);

export { router };
