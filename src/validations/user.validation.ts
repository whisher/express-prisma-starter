import { object, string } from 'yup';

export const userCreateValidation = object({
  email: string().required().email(),
  password: string().required().max(20),
  username: string().required().max(20),
});

export const userUpdateValidation = object({
  id: string().required(),
  email: string().required().email(),
  username: string().required().max(20),
});
