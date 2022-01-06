import { Response } from 'express';

export const successResponseWithData = <T extends unknown>(
  res: Response,
  data: T
) => {
  return res.status(200).json(data) as T;
};

export const errorResponse = (res: Response) => {
  return res.status(500).json({ message: 'Internal Server Error' });
};

export const notFoundResponse = (res: Response, message: string) => {
  return res.status(404).json({ message });
};

export const validationErrorWithData = (res: Response, message: string) => {
  return res.status(422).json({ message });
};

export const unauthorizedResponse = (res: Response, message: string) => {
  return res.status(401).json({ message });
};
