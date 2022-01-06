import { Router } from 'express';
import { router as authRouter } from './auth';
import { router as userRouter } from './user';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

export { router };
