import jwt from 'express-jwt';

const authenticate = jwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ['HS256'],
});

export default authenticate;
