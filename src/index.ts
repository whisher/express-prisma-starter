import dotenv from 'dotenv';
import path from 'path';
const config = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: config });

import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Core
import { join } from 'path';

// Cors
const baseUrlApi = process.env.URL_CORS;

const corsOptions: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: baseUrlApi,
  preflightContinue: false,
};

// Boot express
const app: Application = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

// heroku to get https protocol
app.enable('trust proxy');

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

// Routes
import indexRouter from './routes/home';
import { router as apiRouter } from './routes';

// Helpers
import {
  notFoundResponse,
  unauthorizedResponse,
} from './helpers/api-response.helper';

//Route Prefixes
app.use('/', indexRouter);
app.use('/api/', apiRouter);

// throw 404 if URL not found
app.all('*', (req, res) => {
  return notFoundResponse(res, 'Page not found');
});

// throw 401 for unauthorized user
app.use(
  (
    err: { name: string; message: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err.name == 'UnauthorizedError') {
      return unauthorizedResponse(res, err.message);
    }
  }
);

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
