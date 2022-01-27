import { object, string, boolean } from 'yup';

export const todoCreateValidation = object({
  name: string().required().max(280),
});

export const todoUpdateValidation = object({
  isDone: boolean().required(),
  name: string().required().max(280),
});
