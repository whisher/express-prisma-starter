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

router.post('', validateBody(todoCreateValidation), add);
router.get('', getAll);
router.delete('/:id', remove);
router.put('/:id', validateBody(todoUpdateValidation), update);

export { router };
