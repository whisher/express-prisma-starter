import { boolean, object, string } from 'yup';

export const authLoginValidation = object({
  email: string().required().email(),
  password: string().required().max(20),
});

export const authSignInValidation = object({
  acceptPrivacyPolicy: boolean().isTrue(),
  email: string().required().email(),
  password: string().required().max(20),
  username: string().required().max(20),
});
